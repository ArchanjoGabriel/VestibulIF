from datetime import datetime

from sqlalchemy.orm import Session

from app.models import RefreshToken


class RefreshTokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def criar_refresh_token(
        self,
        token_hash: str,
        user_id: int,
        expires_at: datetime,
        created_at: datetime,
    ) -> RefreshToken:
        refresh_token = RefreshToken(
            token_hash=token_hash,
            user_id=user_id,
            expires_at=expires_at,
            created_at=created_at,
        )

        self.db.add(refresh_token)
        self.db.commit()
        self.db.refresh(refresh_token)
        return refresh_token

    def buscar_por_hash(self, token_hash: str) -> RefreshToken | None:
        return self.db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()

    def revogar_token(self, refresh_token: RefreshToken) -> RefreshToken:
        refresh_token.revoked = True
        self.db.commit()
        self.db.refresh(refresh_token)
        return refresh_token
