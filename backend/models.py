from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

# --- Enums ---
class UserRole(str, enum.Enum):
    ADMIN = "admin"
    ANNOTATOR = "annotator"
    REVIEWER = "reviewer"

class ProjectStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"

# --- Models ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.ANNOTATOR)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    annotations = relationship("Annotation", back_populates="annotator")
    reviews = relationship("Review", back_populates="reviewer")
    notifications = relationship("Notification", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text)
    category = Column(String)
    instructions = Column(Text)
    deadline = Column(DateTime)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.DRAFT)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    datasets = relationship("Dataset", back_populates="project")
    tasks = relationship("TaskAssignment", back_populates="project")
    disagreements = relationship("Disagreement", back_populates="project")

class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    name = Column(String)
    file_type = Column(String)
    total_records = Column(Integer, default=0)
    imported_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="datasets")
    records = relationship("DatasetRecord", back_populates="dataset")

class DatasetRecord(Base):
    __tablename__ = "dataset_records"
    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    content = Column(Text, nullable=False)
    category = Column(String)
    is_duplicate = Column(Boolean, default=False)

    # Relationships
    dataset = relationship("Dataset", back_populates="records")
    tasks = relationship("TaskAssignment", back_populates="record")
    annotations = relationship("Annotation", back_populates="record")

class TaskAssignment(Base):
    __tablename__ = "task_assignments"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    record_id = Column(Integer, ForeignKey("dataset_records.id"))
    annotator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING)
    priority = Column(String, default="Medium")
    assigned_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    project = relationship("Project", back_populates="tasks")
    record = relationship("DatasetRecord", back_populates="tasks")
    annotator = relationship("User")

class Annotation(Base):
    __tablename__ = "annotations"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("task_assignments.id"))
    record_id = Column(Integer, ForeignKey("dataset_records.id"))
    annotator_id = Column(Integer, ForeignKey("users.id"))
    label = Column(String, nullable=False)
    notes = Column(Text)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    record = relationship("DatasetRecord", back_populates="annotations")
    annotator = relationship("User", back_populates="annotations")
    review = relationship("Review", back_populates="annotation", uselist=False)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    annotation_id = Column(Integer, ForeignKey("annotations.id"), unique=True)
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Integer) # 0, 50, 80, 100
    feedback = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    annotation = relationship("Annotation", back_populates="review")
    reviewer = relationship("User", back_populates="reviews")

class Disagreement(Base):
    __tablename__ = "disagreements"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    record_id = Column(Integer, ForeignKey("dataset_records.id"))
    final_label = Column(String)
    resolved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolution_notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="disagreements")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="notifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_type = Column(String)
    description = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="audit_logs")