from fastapi import APIRouter, status, Depends
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth_schema import LoginRequest, TokenResponse, RefreshRequest, LogoutRequest
from app.schemas.user_schema import CreateUserResponse, CreateUser, GetUser
from app.core.database import get_db
from app.services.auth_service import AuthService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    user_repository = UserRepository(db)
    refresh_token_repository = RefreshTokenRepository(db)
    return AuthService(user_repository, refresh_token_repository)

def get_current_user(token: str = Depends(oauth2_scheme), auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.get_current_user(token)

router = APIRouter(
    tags=["authentication"],
    prefix="/api/auth",
)

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=CreateUserResponse)
def register(user_in: CreateUser, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.register_user(user_in)

@router.post("/login", response_model=TokenResponse)
def login(login_in: LoginRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.login(login_in)

@router.post("/refresh", response_model=TokenResponse)
def refresh(refresh_in: RefreshRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.refresh_token(refresh_in.refresh_token)

@router.post("/logout")
def logout(logout_in: LogoutRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.logout(logout_in.refresh_token)

@router.get("/me", response_model=GetUser)
def me(user = Depends(get_current_user)):
    return user
