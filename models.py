from sqlalchemy import (
    Boolean,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint
)

from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


# Usuario

class Usuario(Base):

    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    usuario: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    password: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    activo: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    es_admin: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    favoritos = relationship(
        "Favorito",
        back_populates="usuario",
        cascade="all, delete-orphan"
    )


# Producto

class Producto(Base):

    __tablename__ = "productos"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    categoria: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    pais: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    descripcion: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    disponible: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    destacado: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    favoritos = relationship(
        "Favorito",
        back_populates="producto",
        cascade="all, delete-orphan"
    )


# Favorito

class Favorito(Base):

    __tablename__ = "favoritos"

    __table_args__ = (
        UniqueConstraint(
            "usuario_id",
            "producto_id",
            name="uq_usuario_producto"
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    usuario_id: Mapped[int] = mapped_column(
        ForeignKey("usuarios.id"),
        nullable=False,
        index=True
    )

    producto_id: Mapped[int] = mapped_column(
        ForeignKey("productos.id"),
        nullable=False,
        index=True
    )

    usuario = relationship(
        "Usuario",
        back_populates="favoritos"
    )

    producto = relationship(
        "Producto",
        back_populates="favoritos"
    )