from database import SessionLocal, engine
import models
import auth

def seed_database():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if admin exists
    admin = db.query(models.User).filter(models.User.email == "admin@labelforge.com").first()
    if not admin:
        hashed_pw = auth.get_password_hash("admin123")
        admin_user = models.User(
            email="admin@labelforge.com",
            hashed_password=hashed_pw,
            full_name="System Administrator",
            role=models.UserRole.ADMIN
        )
        db.add(admin_user)
        db.commit()
        print("Default admin created: admin@labelforge.com / admin123")
    else:
        print("Admin already exists.")
    
    db.close()

if __name__ == "__main__":
    seed_database()