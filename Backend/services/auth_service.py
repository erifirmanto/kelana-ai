import bcrypt

from models.user import User
from database import SessionLocal
from jose import jwt

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        bytes(password, encoding="utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

def create_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id)
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def register(name: str, email: str, password: str):
    db = SessionLocal()

    # NEVER store plain text - hash the password
    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

    return user

def login(email: str, password: str):
    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        db.close()
        return None

    if not bcrypt.checkpw(
        bytes(password, encoding="utf-8"),
        bytes(user.password_hash, encoding="utf-8")
    ):
        db.close()
        return None

    token = create_token(user.id)

    db.close()

    return token