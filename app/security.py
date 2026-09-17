from pwdlib import PasswordHash

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User


from datetime import datetime,timedelta, timezone
import jwt

from app.config import (JWT_ALGORITHM, JWT_EXPIRE_MINUTES, JWT_SECRET_KEY)


#authorization
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl='/auth/login'
)




password_hash = PasswordHash.recommended()

def hash_password(password: str) -> str:
    return password_hash.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)

def create_access_token(user_id: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)

    payload = {
        'sub': str(user_id),
        'exp': expires_at
    }

    return jwt.encode(
        payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM
    )

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=' Could not validate credentials',
        headers={
            'WWW-authenticate': 'Bearer'
        }
    )

    try:
        payload = jwt.decode(
            token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM]
        )

        user_id = payload.get('sub')

        if user_id is None:
            print('user is id NONE')
            raise credentials_exception

    except jwt.InvalidTokenError:
        print('Invalid token')
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        print('user does not exist')
        raise credentials_exception

    return user
