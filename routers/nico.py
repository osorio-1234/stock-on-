from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from nico_respuestas import buscar_respuesta

router = APIRouter(prefix="/api", tags=["nico"])


class NicoRequest(BaseModel):
    pregunta: str


@router.post("/nico")
def preguntar_a_nico(datos: NicoRequest):
    pregunta = datos.pregunta.strip()

    if not pregunta:
        raise HTTPException(status_code=400, detail="Escribe una pregunta.")

    return {"ok": True, "respuesta": buscar_respuesta(pregunta)}
