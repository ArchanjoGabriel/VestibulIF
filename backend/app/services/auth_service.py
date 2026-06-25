from fastapi import HTTPException, status
from werkzeug.security import generate_password_hash

from app.models import User
from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import CreateUser


class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def _hashed_password(self, password: str) -> str:
        return generate_password_hash(password)

    def register_user(self, user_in: CreateUser) -> User:
        if self.user_repository.find_by_email(user_in.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )
        hashed_password = self._hashed_password(user_in.password)
        return self.user_repository.create_new_user(user_in, hashed_password)

