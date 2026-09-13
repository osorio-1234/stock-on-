from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import auth, nico, productos

app = FastAPI(title="Stock On API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(productos.router)
app.include_router(nico.router)


@app.get("/api/health")
def health():
    return {"ok": True, "mensaje": "Stock On API funcionando"}


@app.exception_handler(404)
async def error_404(request, exc):
    return {
        "ok": False,
        "error": "404",
        "mensaje": (
            "Ups, parece que el servidor no pudo encontrar "
            "lo que estabas buscando. Inténtalo más tarde "
            "o comunica el error."
        ),
    }
