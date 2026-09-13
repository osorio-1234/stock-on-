# Stock On

Plataforma académica que organiza información sobre productos
agrícolas y mercados de distintos países.

## Estructura del proyecto

```
app.py                 Punto de entrada de la API (FastAPI)
database.py            Configuración de la base de datos (SQLite)
models.py              Modelos de SQLAlchemy (Usuario, Producto, Favorito)
security.py            Hash y verificación de contraseñas
nico_respuestas.py      Base de conocimiento del chatbot Nico
seed.py                Script para poblar la base de datos con productos de ejemplo
routers/
    auth.py             Endpoints de registro e inicio de sesión
    productos.py        Endpoints de catálogo y favoritos
    nico.py             Endpoint del chatbot Nico

index.html, nosotros.html, servicios.html,
cobertura.html, contacto.html, login.html, 404.html
                        Páginas del sitio

style.css               Estilos de todo el sitio
js/
    api.js              Helper de peticiones a la API (fetch)
    layout.js           Genera el header, footer y modal de Nico compartidos
script.js               Lógica específica de cada página
```

## Cómo levantar el backend

1. Crear un entorno virtual (recomendado):
   ```
   python -m venv venv
   venv\Scripts\activate      # Windows
   source venv/bin/activate   # macOS / Linux
   ```

2. Instalar las dependencias:
   ```
   pip install -r requirements.txt
   ```

3. (Opcional) Cargar productos de ejemplo en la base de datos:
   ```
   python seed.py
   ```

4. Levantar el servidor:
   ```
   uvicorn app:app --reload
   ```

   La API queda disponible en `http://localhost:8000`.

## Cómo abrir el frontend

El frontend es HTML/CSS/JS estático. Ábrelo con la extensión
**Live Server** de VS Code (o cualquier servidor estático) para
que las páginas puedan comunicarse correctamente con la API.

Si el backend corre en una URL distinta a `http://localhost:8000`,
actualiza la constante `API_URL` en `js/api.js`.
