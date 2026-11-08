from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import UserRole, ProjectStatus, TaskStatus

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.ANNOTATOR

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: UserRole
    is_active: bool
    created_at: datetime
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    instructions: Optional[str] = None
    deadline: Optional[datetime] = None
    status: ProjectStatus = ProjectStatus.DRAFT

class ProjectCreate(ProjectBase): pass

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    class Config: from_attributes = True

class DatasetResponse(BaseModel):
    id: int
    project_id: int
    name: str
    file_type: str
    total_records: int
    imported_at: datetime
    class Config: from_attributes = True

class TaskWithRecordResponse(BaseModel):
    id: int
    project_id: int
    record_id: int
    status: TaskStatus
    priority: str
    content: str
    class Config: from_attributes = True

class AnnotationCreate(BaseModel):
    task_id: int
    record_id: int
    label: str
    notes: Optional[str] = None
