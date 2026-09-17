from app.database import SessionLocal
from app.models.user import User


db = SessionLocal()

user = User(
    email="test@example.com",
    username="testuser",
    password_hash="temporary"
)

db.add(user)
db.commit()
db.refresh(user)


print(f"Created user with ID: {user.id}")

db.close()