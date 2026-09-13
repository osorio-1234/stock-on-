from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import Usuario
from security import comprobar_password, crear_hash

router = APIRouter(prefix="/api", tags=["autenticación"])


class UsuarioRequest(BaseModel):
    usuario: str
    password: str


@router.post("/registro")
def registrar_usuario(datos: UsuarioRequest, db: Session = Depends(get_db)):
    usuario = datos.usuario.strip()

    if len(usuario) < 3:
        raise HTTPException(status_code=400, detail="El usuario debe tener mínimo 3 caracteres.")

    if len(usuario) > 50:
        raise HTTPException(status_code=400, detail="El usuario es demasiado largo.")

    if len(datos.password) < 6:
        raise HTTPException(status_code=400, detail="La contraseña debe tener mínimo 6 caracteres.")

    usuario_existente = db.scalar(select(Usuario).where(Usuario.usuario == usuario))

    if usuario_existente is not None:
        raise HTTPException(status_code=409, detail="Ese usuario ya existe.")

    nuevo_usuario = Usuario(
        usuario=usuario,
        password=crear_hash(datos.password),
        activo=True,
        es_admin=False,
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return {
        "ok": True,
        "usuario_id": nuevo_usuario.id,
        "usuario": nuevo_usuario.usuario,
    }


@router.post("/login")
def iniciar_sesion(datos: UsuarioRequest, db: Session = Depends(get_db)):
    usuario = db.scalar(select(Usuario).where(Usuario.usuario == datos.usuario.strip()))

    credenciales_validas = (
        usuario is not None
        and usuario.activo
        and comprobar_password(datos.password, usuario.password)
    )

    if not credenciales_validas:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos.")

    return {
        "ok": True,
        "usuario_id": usuario.id,
        "usuario": usuario.usuario,
        "es_admin": usuario.es_admin,
        "activo": usuario.activo,
    }
