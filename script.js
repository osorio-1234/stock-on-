/* Configuración */

const API_URL = "http://localhost:8000";

const usuarioId = Number(
    sessionStorage.getItem("usuarioId")
) || null;

const usuarioActual =
    sessionStorage.getItem("usuario") || "";


/* Elementos generales */

const menu = document.getElementById("menu");
const navLinks = document.getElementById("nav-links");
const cerrarSesion = document.getElementById("cerrarSesion");
const temaBtn = document.getElementById("temaBtn");

const mensajeGlobal =
    document.getElementById("mensajeGlobal");


/* Menú */

if (menu && navLinks) {

    menu.addEventListener("click", function() {

        const abierto =
            navLinks.classList.toggle("mostrar");

        menu.setAttribute(
            "aria-expanded",
            abierto
        );

    });

}


/* Cerrar sesión */

if (cerrarSesion) {

    cerrarSesion.addEventListener(
        "click",
        function() {

            sessionStorage.removeItem("sesion");
            sessionStorage.removeItem("usuario");
            sessionStorage.removeItem("usuarioId");

            window.location.href = "login.html";

        }
    );

}


/* Tema */

function aplicarTema() {

    const tema =
        localStorage.getItem("tema") || "claro";

    document.documentElement.dataset.theme =
        tema === "oscuro"
            ? "dark"
            : "light";

    if (temaBtn) {

        temaBtn.textContent =
            tema === "oscuro"
                ? "☀"
                : "◐";

    }

}


if (temaBtn) {

    temaBtn.addEventListener(
        "click",
        function() {

            const temaActual =
                localStorage.getItem("tema") || "claro";

            const nuevoTema =
                temaActual === "oscuro"
                    ? "claro"
                    : "oscuro";

            localStorage.setItem(
                "tema",
                nuevoTema
            );

            aplicarTema();

        }
    );

}

aplicarTema();


/* Mensajes */

let mensajeTimeout = null;

function mostrarMensaje(texto) {

    if (!mensajeGlobal) {
        return;
    }

    mensajeGlobal.textContent = texto;

    mensajeGlobal.classList.remove("oculto");

    clearTimeout(mensajeTimeout);

    mensajeTimeout = setTimeout(
        function() {

            mensajeGlobal.classList.add("oculto");

        },
        3500
    );

}


/* Nico */

const nicoBtn =
    document.getElementById("nicoBtn");

const nicoModal =
    document.getElementById("nicoModal");

const cerrarNico =
    document.getElementById("cerrarNico");

const nicoForm =
    document.getElementById("nicoForm");

const nicoPregunta =
    document.getElementById("nicoPregunta");

const nicoRespuesta =
    document.getElementById("nicoRespuesta");


function abrirNico() {

    if (!nicoModal) {
        return;
    }

    nicoModal.classList.remove("oculto");

    nicoPregunta?.focus();

}


function cerrarVentanaNico() {

    nicoModal?.classList.add("oculto");

}


if (nicoBtn) {

    nicoBtn.addEventListener(
        "click",
        abrirNico
    );

}


if (cerrarNico) {

    cerrarNico.addEventListener(
        "click",
        cerrarVentanaNico
    );

}


if (nicoModal) {

    nicoModal.addEventListener(
        "click",
        function(event) {

            if (event.target === nicoModal) {

                cerrarVentanaNico();

            }

        }
    );

}


if (nicoForm) {

    nicoForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const pregunta =
                nicoPregunta.value.trim();

            if (!pregunta) {
                return;
            }

            nicoRespuesta.textContent =
                "Nico está pensando...";

            try {

                const respuesta =
                    await fetch(
                        `${API_URL}/api/nico`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                pregunta
                            })
                        }
                    );

                const datos =
                    await respuesta.json();

                if (!respuesta.ok) {

                    throw new Error(
                        datos.detail ||
                        "Nico no pudo responder."
                    );

                }

                nicoRespuesta.textContent =
                    datos.respuesta;

                nicoPregunta.value = "";

            } catch (error) {

                nicoRespuesta.textContent =
                    "Ups. Nico no pudo conectarse al servidor. "
                    + "Inténtalo nuevamente.";

                console.error(error);

            }

        }
    );

}


/* Login */

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const loginSection =
    document.getElementById("loginSection");

const registerSection =
    document.getElementById("registerSection");

const mostrarRegistro =
    document.getElementById("mostrarRegistro");

const mostrarLogin =
    document.getElementById("mostrarLogin");


if (mostrarRegistro) {

    mostrarRegistro.addEventListener(
        "click",
        function() {

            loginSection?.classList.add("oculto");
            registerSection?.classList.remove("oculto");

        }
    );

}


if (mostrarLogin) {

    mostrarLogin.addEventListener(
        "click",
        function() {

            registerSection?.classList.add("oculto");
            loginSection?.classList.remove("oculto");

        }
    );

}


/* Registro */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const usuario =
                document
                    .getElementById("registroUsuario")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("registroPassword")
                    .value;

            const confirmar =
                document
                    .getElementById("confirmarPassword")
                    .value;

            const error =
                document.getElementById(
                    "registroError"
                );

            error.textContent = "";


            if (usuario.length < 3) {

                error.textContent =
                    "El usuario debe tener mínimo 3 caracteres.";

                return;

            }


            if (password.length < 6) {

                error.textContent =
                    "La contraseña debe tener mínimo 6 caracteres.";

                return;

            }


            if (password !== confirmar) {

                error.textContent =
                    "Las contraseñas no coinciden.";

                return;

            }


            try {

                const respuesta =
                    await fetch(
                        `${API_URL}/api/registro`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                usuario,
                                password
                            })
                        }
                    );


                const datos =
                    await respuesta.json();


                if (!respuesta.ok) {

                    throw new Error(
                        datos.detail ||
                        "No se pudo crear la cuenta."
                    );

                }


                registerForm.reset();

                document.getElementById(
                    "loginUsuario"
                ).value = usuario;

                registerSection.classList.add("oculto");
                loginSection.classList.remove("oculto");

                mostrarMensaje(
                    "Cuenta creada correctamente."
                );

            } catch (error) {

                error.textContent =
                    error.message.includes(
                        "ya existe"
                    )
                        ? error.message
                        : "No pudimos crear la cuenta. "
                        + "Comprueba que el servidor esté funcionando.";

                console.error(error);

            }

        }
    );

}


/* Login */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const usuario =
                document
                    .getElementById("loginUsuario")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("loginPassword")
                    .value;

            const error =
                document.getElementById(
                    "loginError"
                );

            error.textContent = "";


            try {

                const respuesta =
                    await fetch(
                        `${API_URL}/api/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                usuario,
                                password
                            })
                        }
                    );


                const datos =
                    await respuesta.json();


                if (!respuesta.ok) {

                    throw new Error(
                        datos.detail ||
                        "No se pudo iniciar sesión."
                    );

                }


                sessionStorage.setItem(
                    "sesion",
                    "activa"
                );

                sessionStorage.setItem(
                    "usuario",
                    datos.usuario
                );

                sessionStorage.setItem(
                    "usuarioId",
                    datos.usuario_id
                );


                window.location.href =
                    "index.html";

            } catch (error) {

                error.textContent =
                    "Usuario o contraseña incorrectos.";

                console.error(error);

            }

        }
    );

}


/* Protección */

const paginasProtegidas = [
    "index.html",
    "nosotros.html",
    "servicios.html",
    "cobertura.html",
    "contacto.html"
];

const paginaActual =
    window.location.pathname
        .split("/")
        .pop();

const sesionActiva =
    sessionStorage.getItem("sesion") === "activa";


if (
    paginasProtegidas.includes(paginaActual) &&
    !sesionActiva
) {

    window.location.href = "login.html";

}


/* Formulario de contacto */

const formulario =
    document.getElementById("formulario");


if (formulario) {

    formulario.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const nombre =
                document.getElementById("nombre");

            const correo =
                document.getElementById("correo");

            const mensaje =
                document.getElementById("mensaje");

            const errorNombre =
                document.getElementById(
                    "errorNombre"
                );

            const errorCorreo =
                document.getElementById(
                    "errorCorreo"
                );

            const errorMensaje =
                document.getElementById(
                    "errorMensaje"
                );

            const resultado =
                document.getElementById(
                    "resultado"
                );


            errorNombre.textContent = "";
            errorCorreo.textContent = "";
            errorMensaje.textContent = "";
            resultado.textContent = "";


            let valido = true;


            if (
                nombre.value.trim().length < 2
            ) {

                errorNombre.textContent =
                    "Escribe tu nombre.";

                valido = false;

            }


            if (!correo.value.trim()) {

                errorCorreo.textContent =
                    "Escribe tu correo.";

                valido = false;

            } else if (
                !correo.value.includes("@")
            ) {

                errorCorreo.textContent =
                    "Escribe un correo válido.";

                valido = false;

            }


            if (
                mensaje.value.trim().length < 5
            ) {

                errorMensaje.textContent =
                    "Escribe un mensaje un poco más completo.";

                valido = false;

            }


            if (!valido) {
                return;
            }


            resultado.textContent =
                "El mensaje fue revisado correctamente.";

            formulario.reset();

        }
    );

}


/* Catálogo */

const productList =
    document.getElementById("productList");

const buscadorProducto =
    document.getElementById("buscadorProducto");

const filtroPais =
    document.getElementById("filtroPais");

const soloFavoritos =
    document.getElementById("soloFavoritos");

const resultadoCatalogo =
    document.getElementById("resultadoCatalogo");


let productos = [];


async function cargarProductos() {

    if (!productList) {
        return;
    }


    try {

        const parametroUsuario =
            usuarioId
                ? `?usuario_id=${usuarioId}`
                : "";


        const respuesta =
            await fetch(
                `${API_URL}/api/productos${parametroUsuario}`
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar los productos."
            );

        }


        productos =
            await respuesta.json();


        renderizarProductos();

    } catch (error) {

        productList.innerHTML = `
            <div class="empty-state">
                <h3>No pudimos cargar el catálogo</h3>
                <p>
                    Ups, parece que el servidor no respondió.
                    Inténtalo más tarde o comunica el error.
                </p>
            </div>
        `;

        console.error(error);

    }

}


function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;

}


function renderizarProductos() {

    if (!productList) {
        return;
    }


    const texto =
        buscadorProducto?.value
            .trim()
            .toLowerCase() || "";


    const pais =
        filtroPais?.value || "";


    const favoritosActivos =
        soloFavoritos?.checked === true;


    const filtrados =
        productos.filter(
            function(producto) {

                const nombre =
                    producto.nombre
                        .toLowerCase();

                const descripcion =
                    producto.descripcion
                        .toLowerCase();

                const coincideTexto =
                    nombre.includes(texto) ||
                    descripcion.includes(texto);


                const coincidePais =
                    pais === "" ||
                    producto.pais === pais;


                const coincideFavorito =
                    !favoritosActivos ||
                    producto.es_favorito === true;


                return (
                    coincideTexto &&
                    coincidePais &&
                    coincideFavorito
                );

            }
        );


    if (resultadoCatalogo) {

        resultadoCatalogo.textContent =
            filtrados.length;

    }


    if (filtrados.length === 0) {

        productList.innerHTML = `
            <div class="empty-state">
                <h3>No encontramos productos</h3>
                <p>
                    Prueba con otro nombre, país o filtro.
                </p>
            </div>
        `;

        return;

    }


    const fragment =
        document.createDocumentFragment();


    filtrados.forEach(
        function(producto) {

            const tarjeta =
                document.createElement("article");

            tarjeta.className =
                "product-card";


            tarjeta.dataset.productoId =
                producto.id;


            const nombre =
                escaparHTML(producto.nombre);

            const categoria =
                escaparHTML(producto.categoria);

            const paisProducto =
                escaparHTML(producto.pais);

            const descripcion =
                escaparHTML(producto.descripcion);


            tarjeta.innerHTML = `

                <div class="product-card-top">

                    <span class="product-country">
                        ${paisProducto}
                    </span>

                    <button
                        class="favorite-btn"
                        data-favorite="${producto.id}"
                        type="button"
                        aria-label="${
                            producto.es_favorito
                                ? "Quitar de favoritos"
                                : "Agregar a favoritos"
                        }"
                        title="${
                            producto.es_favorito
                                ? "Quitar de favoritos"
                                : "Agregar a favoritos"
                        }"
                    >
                        ${
                            producto.es_favorito
                                ? "★"
                                : "☆"
                        }
                    </button>

                </div>


                <p class="product-category">
                    ${categoria}
                </p>


                <h3>
                    ${nombre}
                </h3>


                <p>
                    ${descripcion}
                </p>


                <span class="
                    product-status
                    ${
                        producto.disponible
                            ? "available"
                            : "unavailable"
                    }
                ">
                    ${
                        producto.disponible
                            ? "Disponible"
                            : "No disponible"
                    }
                </span>

            `;


            fragment.appendChild(tarjeta);

        }
    );


    productList.replaceChildren(fragment);

}


/* Favoritos */

if (productList) {

    productList.addEventListener(
        "click",
        async function(event) {

            const boton =
                event.target.closest(
                    "[data-favorite]"
                );


            if (!boton) {
                return;
            }


            if (!usuarioId) {

                mostrarMensaje(
                    "Inicia sesión para guardar favoritos."
                );

                return;

            }


            const productoId =
                Number(
                    boton.dataset.favorite
                );


            boton.disabled = true;


            try {

                const respuesta =
                    await fetch(
                        `${API_URL}/api/favoritos`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                usuario_id: usuarioId,
                                producto_id: productoId
                            })
                        }
                    );


                const datos =
                    await respuesta.json();


                if (!respuesta.ok) {

                    throw new Error(
                        datos.detail ||
                        "No se pudo actualizar el favorito."
                    );

                }


                const producto =
                    productos.find(
                        function(item) {

                            return (
                                item.id === productoId
                            );

                        }
                    );


                if (producto) {

                    producto.es_favorito =
                        datos.es_favorito;

                }


                renderizarProductos();


            } catch (error) {

                mostrarMensaje(
                    "No pudimos actualizar el favorito."
                );

                console.error(error);

            }

        }
    );

}


/* Filtros */

buscadorProducto?.addEventListener(
    "input",
    renderizarProductos
);

filtroPais?.addEventListener(
    "change",
    renderizarProductos
);

soloFavoritos?.addEventListener(
    "change",
    renderizarProductos
);


cargarProductos();