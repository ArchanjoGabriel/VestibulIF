from sqlalchemy.orm import Session

from app.models import User
from app.schemas.user_schema import CreateUser


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()

    def find_by_id(self, user_id: int) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()

    def create_new_user(self, user_in: CreateUser, hashed_password) -> User:
        user = User(
            name=user_in.name,
            email=user_in.email,
            password=hashed_password,
        )

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user