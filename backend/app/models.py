import enum
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class DificuldadeEnum(str, enum.Enum):
    FACIL = "Facil"
    MEDIA = "Media"
    DIFICIL = "Dificil"


# =========================================
# 1. MODELO USUARIO
# =========================================


class Usuario(Base):
    __tablename__ = "usuario"

    id_usuario: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False, unique=True)
    senha: Mapped[str] = mapped_column(String(255), nullable=False)

    # Relacionamentos
    estatisticas: Mapped[list["Estatistica"]] = relationship(
        back_populates="usuario",
        cascade="all, delete-orphan",
    )


# =========================================
# 2. MODELO QUESTOES
# =========================================


class Questao(Base):
    __tablename__ = "questoes"

    id_questao: Mapped[int] = mapped_column(primary_key=True)
    enunciado: Mapped[str] = mapped_column(Text, nullable=False)
    materia: Mapped[str] = mapped_column(String(50), nullable=False)
    dificuldade: Mapped[DificuldadeEnum] = mapped_column(
        Enum(
            DificuldadeEnum,
            values_callable=lambda obj: [e.value for e in obj],
        ),
        nullable=False,
    )

    # Relacionamentos
    alternativas: Mapped[list["Alternativa"]] = relationship(
        back_populates="questao",
        cascade="all, delete-orphan",
    )
    estatisticas: Mapped[list["Estatistica"]] = relationship(
        back_populates="questao",
        cascade="all, delete-orphan",
    )


# =========================================
# 3. MODELO ALTERNATIVAS
# =========================================


class Alternativa(Base):
    __tablename__ = "alternativas"

    id_alternativa: Mapped[int] = mapped_column(primary_key=True)
    id_questao: Mapped[int] = mapped_column(
        ForeignKey("questoes.id_questao", ondelete="CASCADE"),
        nullable=False,
    )
    letra: Mapped[str] = mapped_column(String(1), nullable=False)
    texto: Mapped[str] = mapped_column(Text, nullable=False)
    correta: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    # Relacionamentos
    questao: Mapped["Questao"] = relationship(back_populates="alternativas")
    estatisticas: Mapped[list["Estatistica"]] = relationship(
        back_populates="alternativa",
    )


# =========================================
# 4. MODELO ESTATISTICAS
# =========================================


class Estatistica(Base):
    __tablename__ = "estatisticas"

    # Chave Primária Composta
    id_usuario: Mapped[int] = mapped_column(
        ForeignKey("usuario.id_usuario", ondelete="CASCADE"),
        primary_key=True,
    )
    id_questao: Mapped[int] = mapped_column(
        ForeignKey("questoes.id_questao", ondelete="CASCADE"),
        primary_key=True,
    )

    id_alternativa: Mapped[Optional[int]] = mapped_column(
        ForeignKey("alternativas.id_alternativa", ondelete="SET NULL"),
        nullable=True,
    )
    acertou: Mapped[bool] = mapped_column(Boolean, nullable=False)
    tempo_resposta: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    data_resposta: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )
    total_questoes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        server_default="0",
    )
    total_acertos: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        server_default="0",
    )

    # Relacionamentos
    usuario: Mapped["Usuario"] = relationship(back_populates="estatisticas")
    questao: Mapped["Questao"] = relationship(back_populates="estatisticas")
    alternativa: Mapped[Optional["Alternativa"]] = relationship(
        back_populates="estatisticas",
    )


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[int] = mapped_column(primary_key=True)
    token_hash: Mapped[str] = mapped_column(String(64), nullable=False, unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    user: Mapped[User] = relationship(back_populates="refresh_tokens")
