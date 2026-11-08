from database import SessionLocal, engine
import models
from datetime import datetime, timedelta

def seed_data():
    db = SessionLocal()
    # Check if we already seeded
    if db.query(models.Project).count() > 0:
        print("Data already seeded.")
        db.close()
        return

    admin = db.query(models.User).filter(models.User.role == models.UserRole.ADMIN).first()
    
    # 1. Create a Project
    project = models.Project(
        name="Sentiment Analysis Phase 1",
        description="Classify customer reviews as Positive, Negative, or Neutral.",
        category="Text Classification",
        instructions="Read the text and select the most appropriate label.",
        deadline=datetime.utcnow() + timedelta(days=7),
        status=models.ProjectStatus.ACTIVE
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # 2. Create a Dataset
    dataset = models.Dataset(project_id=project.id, name="reviews.csv", file_type="csv", total_records=10)
    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    # 3. Create Records and Tasks
    for i in range(10):
        record = models.DatasetRecord(dataset_id=dataset.id, content=f"This is sample review text number {i+1}.", category="Review")
        db.add(record)
        db.commit()
        db.refresh(record)
        
        task = models.TaskAssignment(
            project_id=project.id, record_id=record.id, annotator_id=admin.id,
            status=models.TaskStatus.PENDING if i % 2 == 0 else models.TaskStatus.SUBMITTED,
            priority="High" if i % 3 == 0 else "Medium"
        )
        db.add(task)

    db.commit()
    db.close()
    print("Mock data seeded successfully!")

if __name__ == "__main__":
    seed_data()
