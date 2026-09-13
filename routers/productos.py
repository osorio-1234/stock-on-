from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import Favorito, Producto, Usuario

router = APIRouter(prefix="/api", tags=["productos"])


class FavoritoRequest(BaseModel):
    usuario_id: int
    producto_id: int


@router.get("/productos")
def obtener_productos(usuario_id: int | None = None, db: Session = Depends(get_db)):
    productos = db.scalars(
        select(Producto).order_by(Producto.pais, Producto.nombre)
    ).all()

    favoritos_ids = set()

    if usuario_id is not None:
        usuario = db.get(Usuario, usuario_id)

        if usuario is not None and usuario.activo:
            favoritos_db = db.scalars(
                select(Favorito).where(Favorito.usuario_id == usuario_id)
            ).all()

            favoritos_ids = {favorito.producto_id for favorito in favoritos_db}

    return [
        {
            "id": producto.id,
            "nombre": producto.nombre,
            "categoria": producto.categoria,
            "pais": producto.pais,
            "descripcion": producto.descripcion,
            "disponible": producto.disponible,
            "destacado": producto.destacado,
            "es_favorito": producto.id in favoritos_ids,
        }
        for producto in productos
    ]


@router.post("/favoritos")
def cambiar_favorito(datos: FavoritoRequest, db: Session = Depends(get_db)):
    usuario = db.get(Usuario, datos.usuario_id)

    if usuario is None or not usuario.activo:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    producto = db.get(Producto, datos.producto_id)

    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado.")

    favorito = db.scalar(
        select(Favorito).where(
            Favorito.usuario_id == datos.usuario_id,
            Favorito.producto_id == datos.producto_id,
        )
    )

    if favorito is None:
        db.add(Favorito(usuario_id=datos.usuario_id, producto_id=datos.producto_id))
        es_favorito = True
    else:
        db.delete(favorito)
        es_favorito = False

    db.commit()

    return {"ok": True, "es_favorito": es_favorito}
