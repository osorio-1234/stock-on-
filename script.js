/* login */

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

const mostrarRegistro = document.getElementById("mostrarRegistro");
const mostrarLogin = document.getElementById("mostrarLogin");


/* mostrar registro */

if (mostrarRegistro) {

    mostrarRegistro.addEventListener("click", function() {

        loginSection.classList.add("oculto");
        registerSection.classList.remove("oculto");

    });

}


/* mostrar login */

if (mostrarLogin) {

    mostrarLogin.addEventListener("click", function() {

        registerSection.classList.add("oculto");
        loginSection.classList.remove("oculto");

    });

}


/* crear cuenta */

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const usuario = document.getElementById("registroUsuario").value.trim();
        const password = document.getElementById("registroPassword").value;
        const confirmar = document.getElementById("confirmarPassword").value;
        const error = document.getElementById("registroError");

        error.textContent = "";

        if (usuario.length < 3) {

            error.textContent =
                "El usuario debe tener mínimo 3 caracteres.";

            return;

        }

        if (password.length < 4) {

            error.textContent =
                "La contraseña debe tener mínimo 4 caracteres.";

            return;

        }

        if (password !== confirmar) {

            error.textContent =
                "Las contraseñas no coinciden.";

            return;

        }

        const cuentas =
            JSON.parse(localStorage.getItem("cuentas")) || [];

        const existe = cuentas.some(function(cuenta) {

            return cuenta.usuario === usuario;

        });

        if (existe) {

            error.textContent =
                "Ese usuario ya existe.";

            return;

        }

        cuentas.push({
            usuario: usuario,
            password: password
        });

        localStorage.setItem("cuentas", JSON.stringify(cuentas));

        registerForm.reset();

        alert("Cuenta creada correctamente.");

        registerSection.classList.add("oculto");
        loginSection.classList.remove("oculto");

        document.getElementById("loginUsuario").value = usuario;

    });

}


/* iniciar sesión */

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const usuario =
            document.getElementById("loginUsuario").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const error =
            document.getElementById("loginError");

        error.textContent = "";

        const cuentas =
            JSON.parse(localStorage.getItem("cuentas")) || [];

        const cuenta = cuentas.find(function(cuenta) {

            return (
                cuenta.usuario === usuario &&
                cuenta.password === password
            );

        });

        if (!cuenta) {

            error.textContent =
                "Usuario o contraseña incorrectos.";

            return;

        }

        sessionStorage.setItem("sesion", "activa");
        sessionStorage.setItem("usuario", usuario);

        window.location.href = "index.html";

    });

}


/* proteger paginas */

const paginasProtegidas = [
    "index.html",
    "nosotros.html",
    "servicios.html",
    "cobertura.html",
    "contacto.html"
];

const paginaActual =
    window.location.pathname.split("/").pop();

if (
    paginasProtegidas.includes(paginaActual) &&
    sessionStorage.getItem("sesion") !== "activa"
) {

    window.location.href = "login.html";

}


/* menu */

const menu = document.getElementById("menu");
const navLinks = document.getElementById("nav-links");

if (menu) {

    menu.addEventListener("click", function() {

        navLinks.classList.toggle("mostrar");

    });

}


/* cerrar sesion */

const cerrarSesion =
    document.getElementById("cerrarSesion");

if (cerrarSesion) {

    cerrarSesion.addEventListener("click", function() {

        sessionStorage.removeItem("sesion");
        sessionStorage.removeItem("usuario");

        window.location.href = "login.html";

    });

}


/* formulario */

const formulario =
    document.getElementById("formulario");

if (formulario) {

    formulario.addEventListener("submit", function(event) {

        event.preventDefault();

        const nombre =
            document.getElementById("nombre");

        const correo =
            document.getElementById("correo");

        const mensaje =
            document.getElementById("mensaje");

        const errorNombre =
            document.getElementById("errorNombre");

        const errorCorreo =
            document.getElementById("errorCorreo");

        const errorMensaje =
            document.getElementById("errorMensaje");

        const resultado =
            document.getElementById("resultado");

        errorNombre.textContent = "";
        errorCorreo.textContent = "";
        errorMensaje.textContent = "";
        resultado.textContent = "";

        let valido = true;

        if (nombre.value.trim() === "") {

            errorNombre.textContent =
                "Escribe tu nombre.";

            valido = false;

        }

        if (correo.value.trim() === "") {

            errorCorreo.textContent =
                "Escribe tu correo.";

            valido = false;

        } else if (!correo.value.includes("@")) {

            errorCorreo.textContent =
                "Escribe un correo válido.";

            valido = false;

        }

        if (mensaje.value.trim() === "") {

            errorMensaje.textContent =
                "Escribe un mensaje.";

            valido = false;

        }

        if (valido) {

            resultado.textContent =
                "El mensaje fue revisado correctamente.";

            formulario.reset();

        }

    });

}