/*
 * Header, footer y modal de Nico eran el mismo bloque de HTML
 * copiado en index.html, nosotros.html, servicios.html,
 * cobertura.html y contacto.html. Este archivo los genera una
 * sola vez y los inserta donde encuentre los contenedores
 * #layout-header, #layout-footer y #layout-nico.
 *
 * Se ejecuta de forma síncrona (sin esperar a DOMContentLoaded)
 * para que, cuando script.js se ejecute justo después, los
 * elementos como #menu, #nicoBtn o #nicoModal ya existan.
 */

const ENLACES_NAV = [
    { archivo: "index.html", texto: "Inicio" },
    { archivo: "nosotros.html", texto: "Nosotros" },
    { archivo: "servicios.html", texto: "Catálogo" },
    { archivo: "cobertura.html", texto: "Cobertura" },
    { archivo: "contacto.html", texto: "Contacto" },
];

function obtenerPaginaActual() {
    return window.location.pathname.split("/").pop() || "index.html";
}

function generarEnlacesNav() {
    const paginaActual = obtenerPaginaActual();

    return ENLACES_NAV.map(function (enlace) {
        const esActivo = enlace.archivo === paginaActual;
        const clase = esActivo ? ' class="activo"' : "";
        return `<a${clase} href="${enlace.archivo}">${enlace.texto}</a>`;
    }).join("\n");
}

function generarHeader() {
    return `
        <header>
            <nav class="navbar">

                <a href="index.html" class="logo">
                    Stock <span>On</span>
                </a>

                <div class="nav-actions">

                    <button id="temaBtn" class="icon-btn" type="button" aria-label="Cambiar tema" title="Cambiar tema">
                        ◐
                    </button>

                    <button id="nicoBtn" class="nico-btn" type="button">
                        Preguntar a Nico
                    </button>

                    <button id="menu" class="menu-btn" type="button" aria-label="Abrir menú" aria-expanded="false">
                        ☰
                    </button>

                </div>

                <div id="nav-links" class="nav-links">

                    ${generarEnlacesNav()}

                    <button id="cerrarSesion" class="logout-btn" type="button">
                        Cerrar sesión
                    </button>

                </div>

            </nav>
        </header>
    `;
}

function generarFooter() {
    return `
        <footer>
            <p>© 2026 Stock On</p>
            <p>Proyecto académico</p>
        </footer>
    `;
}

function generarModalNico() {
    return `
        <div id="nicoModal" class="modal oculto">

            <div class="modal-box">

                <button id="cerrarNico" class="modal-close" type="button" aria-label="Cerrar">
                    ×
                </button>

                <p class="small-title">Asistente</p>

                <h2>Pregúntale a Nico</h2>

                <p>
                    Puedes preguntarle sobre Stock On, los mercados,
                    productos o cómo utilizar la plataforma.
                </p>

                <div id="nicoRespuesta" class="nico-response">
                    Hola. Soy Nico. Pregúntame algo sobre Stock On.
                </div>

                <form id="nicoForm" class="nico-form">

                    <input id="nicoPregunta" type="text" placeholder="Escribe tu pregunta..." autocomplete="off" required>

                    <button class="btn" type="submit">
                        Preguntar
                    </button>

                </form>

            </div>

        </div>

        <div id="mensajeGlobal" class="mensaje-global oculto"></div>
    `;
}

function insertarLayout() {
    const contenedorHeader = document.getElementById("layout-header");
    const contenedorFooter = document.getElementById("layout-footer");
    const contenedorNico = document.getElementById("layout-nico");

    if (contenedorHeader) {
        contenedorHeader.outerHTML = generarHeader();
    }

    if (contenedorFooter) {
        contenedorFooter.outerHTML = generarFooter();
    }

    if (contenedorNico) {
        contenedorNico.outerHTML = generarModalNico();
    }
}

insertarLayout();
