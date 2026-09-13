/*
 * El patrón "fetch + try/catch + leer JSON + revisar respuesta.ok"
 * se repetía igual en login, registro, favoritos y Nico. Esta
 * función lo centraliza en un solo lugar.
 *
 * Lanza un Error con el mensaje que envía la API (datos.detail)
 * cuando la respuesta no es exitosa, igual que hacía cada bloque
 * repetido antes.
 */

const API_URL = "http://localhost:8000";

async function apiPost(ruta, cuerpo, mensajePorDefecto = "Ocurrió un error inesperado.") {
    const respuesta = await fetch(`${API_URL}${ruta}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.detail || mensajePorDefecto);
    }

    return datos;
}

async function apiGet(ruta) {
    const respuesta = await fetch(`${API_URL}${ruta}`);

    if (!respuesta.ok) {
        throw new Error("No se pudo completar la solicitud.");
    }

    return respuesta.json();
}
