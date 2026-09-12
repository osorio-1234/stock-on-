import hashlib
import hmac
import secrets

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Favorito, Producto, Usuario


# Configuración

app = FastAPI(
    title="Stock On API",
    version="3.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


Base.metadata.create_all(bind=engine)


# Modelos

class UsuarioRequest(BaseModel):
    usuario: str
    password: str


class FavoritoRequest(BaseModel):
    usuario_id: int
    producto_id: int


class NicoRequest(BaseModel):
    pregunta: str


# Seguridad

def crear_hash(password: str) -> str:

    salt = secrets.token_bytes(16)

    clave = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        120000
    )

    return (
        salt.hex()
        + ":"
        + clave.hex()
    )


def comprobar_password(password: str, password_hash: str) -> bool:

    try:

        salt_hex, clave_hex = password_hash.split(":")

        salt = bytes.fromhex(salt_hex)

        clave = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt,
            120000
        )

        return hmac.compare_digest(
            clave.hex(),
            clave_hex
        )

    except ValueError:

        return False


# Estado

@app.get("/api/health")
def health():

    return {
        "ok": True,
        "mensaje": "Stock On API funcionando"
    }


# Registro

@app.post("/api/registro")
def registrar_usuario(
    datos: UsuarioRequest,
    db: Session = Depends(get_db)
):

    usuario = datos.usuario.strip()

    if len(usuario) < 3:

        raise HTTPException(
            status_code=400,
            detail="El usuario debe tener mínimo 3 caracteres."
        )

    if len(usuario) > 50:

        raise HTTPException(
            status_code=400,
            detail="El usuario es demasiado largo."
        )

    if len(datos.password) < 6:

        raise HTTPException(
            status_code=400,
            detail="La contraseña debe tener mínimo 6 caracteres."
        )

    usuario_existente = db.scalar(
        select(Usuario).where(
            Usuario.usuario == usuario
        )
    )

    if usuario_existente is not None:

        raise HTTPException(
            status_code=409,
            detail="Ese usuario ya existe."
        )

    nuevo_usuario = Usuario(
        usuario=usuario,
        password=crear_hash(datos.password),
        activo=True,
        es_admin=False
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return {
        "ok": True,
        "usuario_id": nuevo_usuario.id,
        "usuario": nuevo_usuario.usuario
    }


# Inicio de sesión

@app.post("/api/login")
def iniciar_sesion(
    datos: UsuarioRequest,
    db: Session = Depends(get_db)
):

    usuario = db.scalar(
        select(Usuario).where(
            Usuario.usuario == datos.usuario.strip()
        )
    )

    if usuario is None or not usuario.activo:

        raise HTTPException(
            status_code=401,
            detail="Usuario o contraseña incorrectos."
        )

    password_correcta = comprobar_password(
        datos.password,
        usuario.password
    )

    if not password_correcta:

        raise HTTPException(
            status_code=401,
            detail="Usuario o contraseña incorrectos."
        )

    return {
        "ok": True,
        "usuario_id": usuario.id,
        "usuario": usuario.usuario,
        "es_admin": usuario.es_admin,
        "activo": usuario.activo
    }


# Productos

@app.get("/api/productos")
def obtener_productos(
    usuario_id: int | None = None,
    db: Session = Depends(get_db)
):

    productos = db.scalars(
        select(Producto)
        .order_by(Producto.pais, Producto.nombre)
    ).all()

    favoritos = set()

    if usuario_id is not None:

        usuario = db.get(
            Usuario,
            usuario_id
        )

        if usuario is not None and usuario.activo:

            favoritos_db = db.scalars(
                select(Favorito).where(
                    Favorito.usuario_id == usuario_id
                )
            ).all()

            favoritos = {
                favorito.producto_id
                for favorito in favoritos_db
            }

    resultado = []

    for producto in productos:

        es_favorito = producto.id in favoritos

        resultado.append({
            "id": producto.id,
            "nombre": producto.nombre,
            "categoria": producto.categoria,
            "pais": producto.pais,
            "descripcion": producto.descripcion,
            "disponible": producto.disponible,
            "destacado": producto.destacado,
            "es_favorito": es_favorito
        })

    return resultado


# Favoritos

@app.post("/api/favoritos")
def cambiar_favorito(
    datos: FavoritoRequest,
    db: Session = Depends(get_db)
):

    usuario = db.get(
        Usuario,
        datos.usuario_id
    )

    if usuario is None or not usuario.activo:

        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado."
        )

    producto = db.get(
        Producto,
        datos.producto_id
    )

    if producto is None:

        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado."
        )

    favorito = db.scalar(
        select(Favorito).where(
            Favorito.usuario_id == datos.usuario_id,
            Favorito.producto_id == datos.producto_id
        )
    )

    if favorito is None:

        nuevo_favorito = Favorito(
            usuario_id=datos.usuario_id,
            producto_id=datos.producto_id
        )

        db.add(nuevo_favorito)

        es_favorito = True

    else:

        db.delete(favorito)

        es_favorito = False

    db.commit()

    return {
        "ok": True,
        "es_favorito": es_favorito
    }


# Nico

@app.post("/api/nico")
def preguntar_a_nico(
    datos: NicoRequest
):

    pregunta = datos.pregunta.strip().lower()

    if not pregunta:

        raise HTTPException(
            status_code=400,
            detail="Escribe una pregunta."
        )

    respuestas = [

        (
            ["hola", "buenas", "hey"],
            "Hola. Soy Nico, el asistente de Stock On. "
            "Puedes preguntarme sobre productos, mercados, "
            "favoritos o sobre cómo utilizar la plataforma."
        ),

        (
            ["stock on", "que es stock", "qué es stock"],
            "Stock On es una plataforma académica que organiza "
            "información sobre productos agrícolas y mercados "
            "de diferentes países."
        ),

        (
            ["favorito", "favoritos"],
            "Los favoritos son personales. Cuando inicias sesión, "
            "Stock On consulta la base de datos usando tu usuario "
            "para mostrar únicamente los productos que tú has guardado."
        ),

        (
            ["producto", "productos", "catalogo", "catálogo"],
            "Puedes explorar los productos desde el catálogo y "
            "filtrarlos por nombre o país. También puedes marcar "
            "los que quieras conservar como favoritos."
        ),

        (
            ["pais", "país", "paises", "países", "mercado"],
            "Actualmente Stock On trabaja con Colombia, Argentina, "
            "Brasil y Canadá. China está planteada como una futura "
            "ampliación."
        ),

        (
            ["colombia"],
            "Colombia es el mercado principal de la propuesta "
            "actual y cuenta con productos como café, banano, "
            "aguacate, mango, papa y tomate."
        ),

        (
            ["brasil"],
            "Brasil aporta productos tropicales y agrícolas al "
            "catálogo inicial de Stock On."
        ),

        (
            ["argentina"],
            "Argentina forma parte de la cobertura actual y cuenta "
            "con productos como manzana, pera, uva y limón."
        ),

        (
            ["canada", "canadá"],
            "Canadá forma parte de la cobertura actual y aporta "
            "productos agrícolas asociados a regiones de clima frío."
        ),

        (
            ["ayuda", "help"],
            "Puedo orientarte sobre el catálogo, los favoritos, "
            "los mercados, el funcionamiento general de Stock On "
            "y algunas de sus funciones."
        )

    ]

    for palabras, respuesta in respuestas:

        if any(
            palabra in pregunta
            for palabra in palabras
        ):

            return {
                "ok": True,
                "respuesta": respuesta
            }

    return {
        "ok": True,
        "respuesta": (
            "No estoy seguro de haber entendido la pregunta. "
            "Puedes preguntarme, por ejemplo, qué es Stock On, "
            "cómo funcionan los favoritos, qué países están "
            "disponibles o cómo funciona el catálogo."
        )
    }


# Error general

@app.exception_handler(404)
async def error_404(request, exc):

    return {
        "ok": False,
        "error": "404",
        "mensaje": (
            "Ups, parece que el servidor no pudo encontrar "
            "lo que estabas buscando. Inténtalo más tarde "
            "o comunica el error."
        )
    }