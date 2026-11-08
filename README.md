# LabelForge - AI Data Annotation & Quality Management Platform

LabelForge is a modern, full-stack SaaS application built to streamline AI data annotation operations. It provides dedicated portals for Administrators, Annotators, and Reviewers, replacing disconnected spreadsheets with a centralized, interactive dashboard experience.

## 🚀 Features
- **Role-Based Access Control**: JWT authentication for Admin, Annotator, and Reviewer roles.
- **Project Management**: Create projects, define annotation instructions, and assign teams.
- **Dataset Management**: Upload CSV datasets, parse records, and track import stats.
- **Annotation Workspace**: A dedicated interface for workers to label text data (Sentiment Analysis).
- **Quality Assurance**: A Review Queue where reviewers can approve or reject submitted annotations.
- **Analytics Dashboard**: Real-time interactive charts (Recharts) showing daily output, quality trends, and project distributions.

## 💻 Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Zustand, Recharts, React Router.
- **Backend**: Python 3.11, FastAPI, SQLAlchemy, Pydantic, SQLite, JWT (python-jose, passlib).

## 🛠️ Local Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Activate virtual environment
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install fastapi uvicorn sqlalchemy pydantic python-jose[cryptography] passlib[bcrypt] python-multipart pydantic[email]

python seed.py # Seeds the admin user (admin@labelforge.com / admin123)
uvicorn main:app --reload