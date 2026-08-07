from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status
from werkzeug.security import check_password_hash, generate_password_hash

from app.core.security import criar_access_token, criar_refresh_token, hash_refresh_token, decode_access_token
from app.models import User
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth_schema import LoginRequest, TokenResponse
from app.schemas.user_schema import CreateUser


class AuthService:
    def __init__(
        self,
        user_repository: UserRepository,
        refresh_token_repository: RefreshTokenRepository,
    ):
        self.user_repository = user_repository
        self.refresh_token_repository = refresh_token_repository

    def _hashed_password(self, password: str) -> str:
        return generate_password_hash(password)

    def _unauthorized_exception(self, error: str) -> HTTPException:
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=error,
        )

    def get_current_user(self, token: str):
        payload = decode_access_token(token)

        user_id = payload.get("sub")
        if not user_id:
            raise self._unauthorized_exception("Access token inválido")

        user = self.user_repository.find_by_id(user_id)
        if not user:
            raise self._unauthorized_exception("Usuário não encontrado")

        return user

    def register_user(self, user_in: CreateUser) -> User:
        if self.user_repository.find_by_email(user_in.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )
        hashed_password = self._hashed_password(user_in.password)
        return self.user_repository.create_new_user(user_in, hashed_password)

    def login(self, login_in: LoginRequest) -> TokenResponse:
        user = self.user_repository.find_by_email(login_in.email)
        if not user:
            raise self._unauthorized_exception("Usuário não encontrado")

        if not check_password_hash(user.password, login_in.password):
            raise self._unauthorized_exception("Email ou senha incorretos")

        access_token = criar_access_token(user.id)
        refresh_token = criar_refresh_token()
        token_hash = hash_refresh_token(refresh_token)
        now = datetime.now(UTC)

        self.refresh_token_repository.criar_refresh_token(
            token_hash=token_hash,
            user_id=user.id,
            expires_at=now + timedelta(days=30),
            created_at=now,
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="Bearer",
        )

    def logout(self, token: str):
        token_hash = hash_refresh_token(token)
        token_db = self.refresh_token_repository.buscar_por_hash(token_hash)

        if not token_db:
            raise self._unauthorized_exception("Token inválido")
        if token_db.revoked:
            raise self._unauthorized_exception("Refresh token revogado")
        
        expires_at = token_db.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=UTC)

        if expires_at < datetime.now(UTC):
            raise self._unauthorized_exception("Refresh token expirado")

        self.refresh_token_repository.revogar_token(token_db)

        return {"message": "Logout realizado com sucesso"}

    def refresh_token(self, token: str) -> TokenResponse:
        token_hash = hash_refresh_token(token)
        token_db = self.refresh_token_repository.buscar_por_hash(token_hash)

        if not token_db:
            raise self._unauthorized_exception("Refresh token inválido")
        if token_db.revoked:
            raise self._unauthorized_exception("Refresh token revogado")
        expires_at = token_db.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=UTC)

        if expires_at < datetime.now(UTC):
            raise self._unauthorized_exception("Refresh token expirado")

        user = self.user_repository.find_by_id(token_db.user_id)
        if not user:
            raise self._unauthorized_exception("Usuário não encontrado")

        self.refresh_token_repository.revogar_token(token_db)

        access_token = criar_access_token(user.id)
        new_refresh = criar_refresh_token()
        new_hash = hash_refresh_token(new_refresh)
        now = datetime.now(UTC)

        self.refresh_token_repository.criar_refresh_token(
            token_hash=new_hash,
            user_id=user.id,
            expires_at=now + timedelta(days=30),
            created_at=now,
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh,
            token_type="Bearer",
        )
