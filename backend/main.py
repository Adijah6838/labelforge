from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from typing import List
import csv
import io

from database import engine, get_db
import models
import schemas
import auth

models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="LabelForge API", version="1.0.0")

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=False, allow_methods=["*"], allow_headers=["*"],
)

@app.post("/api/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)): return current_user

@app.get("/api/projects", response_model=List[schemas.ProjectResponse])
def get_projects(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)): return db.query(models.Project).all()

@app.post("/api/projects", response_model=schemas.ProjectResponse)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_project = models.Project(**project.model_dump())
    db.add(new_project); db.commit(); db.refresh(new_project); return new_project

@app.get("/api/datasets", response_model=List[schemas.DatasetResponse])
def get_datasets(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)): return db.query(models.Dataset).all()

@app.post("/api/datasets/upload", response_model=schemas.DatasetResponse)
async def upload_dataset(project_id: int = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    content = await file.read()
    csv_text = content.decode('utf-8')
    csv_reader = csv.reader(io.StringIO(csv_text))
    next(csv_reader, None)
    new_dataset = models.Dataset(project_id=project_id, name=file.filename, file_type="csv", total_records=0)
    db.add(new_dataset); db.commit(); db.refresh(new_dataset)
    count = 0
    for row in csv_reader:
        if row:
            record = models.DatasetRecord(dataset_id=new_dataset.id, content=row[0], category="Uncategorized")
            db.add(record)
            count += 1
    new_dataset.total_records = count
    db.commit(); db.refresh(new_dataset); return new_dataset

@app.get("/api/tasks", response_model=List[schemas.TaskWithRecordResponse])
def get_my_tasks(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    query = db.query(models.TaskAssignment).filter(models.TaskAssignment.status == models.TaskStatus.PENDING)
    if current_user.role != models.UserRole.ADMIN:
        query = query.filter(models.TaskAssignment.annotator_id == current_user.id)
    tasks = query.all()
    return [{"id": t.id, "project_id": t.project_id, "record_id": t.record_id, "status": t.status, "priority": t.priority, "content": t.record.content} for t in tasks]

@app.post("/api/annotations")
def submit_annotation(annotation: schemas.AnnotationCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    task = db.query(models.TaskAssignment).filter(models.TaskAssignment.id == annotation.task_id).first()
    if not task: raise HTTPException(status_code=404, detail="Task not found")
    new_annotation = models.Annotation(task_id=annotation.task_id, record_id=annotation.record_id, annotator_id=current_user.id, label=annotation.label, notes=annotation.notes)
    db.add(new_annotation)
    task.status = models.TaskStatus.SUBMITTED
    task.completed_at = datetime.utcnow()
    db.commit()
    return {"message": "Annotation submitted"}

@app.get("/api/reviews/queue")
def get_review_queue(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    tasks = db.query(models.TaskAssignment).filter(models.TaskAssignment.status == models.TaskStatus.SUBMITTED).all()
    results = []
    for t in tasks:
        ann = db.query(models.Annotation).filter(models.Annotation.task_id == t.id).first()
        if ann:
            results.append({"task_id": t.id, "content": t.record.content, "label": ann.label, "annotator_id": ann.annotator_id, "project_id": t.project_id})
    return results

@app.post("/api/reviews/{task_id}")
def submit_review(task_id: int, action: str = Form(...), db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    task = db.query(models.TaskAssignment).filter(models.TaskAssignment.id == task_id).first()
    if not task: raise HTTPException(status_code=404, detail="Task not found")
    if action == "approve": task.status = models.TaskStatus.APPROVED
    elif action == "reject": task.status = models.TaskStatus.REJECTED
    else: raise HTTPException(status_code=400, detail="Invalid action")
    db.commit()
    return {"message": f"Task {action}d"}

@app.get("/api/analytics/overview")
def get_analytics_overview(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return {
        "total_projects": db.query(models.Project).count(), "total_records": db.query(models.DatasetRecord).count(),
        "total_tasks": db.query(models.TaskAssignment).count(), "completed_tasks": db.query(models.TaskAssignment).filter(models.TaskAssignment.status == models.TaskStatus.APPROVED).count(),
        "pending_tasks": db.query(models.TaskAssignment).filter(models.TaskAssignment.status == models.TaskStatus.PENDING).count(),
        "chart_data": [{"name": "Mon", "annotations": 120}, {"name": "Tue", "annotations": 132}, {"name": "Wed", "annotations": 101}, {"name": "Thu", "annotations": 134}, {"name": "Fri", "annotations": 90}]
    }

@app.get("/api/analytics/charts")
def get_analytics_charts(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return {
        "daily_output": [{"day": "Mon", "count": 45}, {"day": "Tue", "count": 52}, {"day": "Wed", "count": 38}, {"day": "Thu", "count": 65}, {"day": "Fri", "count": 48}],
        "quality_trend": [{"week": "W1", "score": 82}, {"week": "W2", "score": 85}, {"week": "W3", "score": 88}, {"week": "W4", "score": 92}],
        "project_distribution": [{"name": "Sentiment", "value": 400}, {"name": "NER", "value": 300}, {"name": "Image", "value": 200}],
        "approval_rate": [{"name": "Approved", "value": 85}, {"name": "Rejected", "value": 15}]
    }
