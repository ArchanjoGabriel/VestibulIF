from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import CreateUserResponse, CreateUser
from app.core.database import get_db
from app.services.auth_service import AuthService


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    user_repository = UserRepository(db)
    return AuthService(user_repository)

router = APIRouter(
    tags=["authentication"],
    prefix="/api/auth",
)

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=CreateUserResponse)
def register(user_in: CreateUser, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.register_user(user_in)