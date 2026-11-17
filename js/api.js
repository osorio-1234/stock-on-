const API_URL = "http://localhost:3000";
async function apiRequest(ruta, opciones={}) {
  const token=sessionStorage.getItem('token');
  const headers={...(opciones.body?{'Content-Type':'application/json'}:{}),...(opciones.headers||{})};
  if(token) headers.Authorization=`Bearer ${token}`;
  let respuesta;
  try { respuesta=await fetch(`${API_URL}${ruta}`,{...opciones,headers}); }
  catch { throw new Error('No se pudo conectar con Stock On. Comprueba que el backend esté encendido.'); }
  const datos=await respuesta.json().catch(()=>({}));
  if(!respuesta.ok) throw new Error(datos.message||datos.detail||'No se pudo completar la solicitud.');
  return datos;
}
function apiPost(ruta,cuerpo,mensaje='Ocurrió un error inesperado.') { return apiRequest(ruta,{method:'POST',body:JSON.stringify(cuerpo)}).catch(e=>{if(!e.message)e.message=mensaje;throw e;}); }
function apiGet(ruta) { return apiRequest(ruta); }
function apiPut(ruta,cuerpo) { return apiRequest(ruta,{method:'PUT',body:JSON.stringify(cuerpo)}); }
function apiDelete(ruta) { return apiRequest(ruta,{method:'DELETE'}); }
