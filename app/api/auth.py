from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.security import (hash_password, create_access_token, verify_password)
from app.schemas.auth import LoginRequest, RegisterRequest


router = APIRouter(
    prefix='/auth',
    tags=['Authentication']
)


@router.post('/register')
def register(
        user_data: RegisterRequest,
        db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.username == user_data.username
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail='Username already exists'
        )

    hashed_password = hash_password(user_data.password)

    user = User(
        email = user_data.email,
        username = user_data.username,
        password_hash=hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        'message': 'User registered successfully',
        'user_id': user.id
    }

@router.post('/login')
def login(
        user_data: LoginRequest,
        db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == user_data.username).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail='Invalid username or password'
        )

    password_is_correct = verify_password(
        user_data.password, user.password_hash)

    if not password_is_correct:
        raise HTTPException(
            status_code=401, detail='Invalid username or password'
        )

    access_token = create_access_token(user.id)
    return {
        'access_token': access_token,
        'token_type': 'bearer'
    }
