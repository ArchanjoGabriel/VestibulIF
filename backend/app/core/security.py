from datetime import UTC, datetime, timedelta
import hashlib
import secrets

from fastapi import HTTPException
from jose import jwt, JWTError

from app.core.config import settings


ACCESS_TOKEN_EXPIRE_MINUTES = 15


def criar_access_token(user_id: int) -> str:
    expires_at = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "exp": expires_at,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token Inválido")

def criar_refresh_token() -> str:
    return secrets.token_urlsafe()


def hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
