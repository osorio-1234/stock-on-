
const router = require('express').Router();
const Product = require('../models/Product');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

// Palabras que no representan productos concretos.
const palabrasGenerales = [
  'producto', 'productos', 'mercado', 'mercados',
  'pais', 'paises', 'categoría', 'categorías',
  'catalogo', 'agricultura', 'stock on',
  'ayuda', 'informacion', 'hola', 'buenas'
];

// Detectar un producto mencionado en la pregunta.
function detectarProducto(pregunta) {
  const q = pregunta.toLowerCase().trim();

  const patrones = [
    /(?:venden|tienen|manejan|ofrecen|busco|necesito|quiero|hay|disponen de|trabajan con)\s+(?:el|la|los|las|un|una|unos|unas)?\s*([a-záéíóúñü]+(?:\s+[a-záéíóúñü]+){0,2})/i,
    /(?:sobre|acerca de)\s+(?:el|la|los|las)?\s*([a-záéíóúñü]+(?:\s+[a-záéíóúñü]+){0,2})/i
  ];

  for (const patron of patrones) {
    const coincidencia = q.match(patron);

    if (coincidencia) {
      const nombre = coincidencia[1].trim();

      if (!palabrasGenerales.includes(nombre)) {
        return nombre;
      }
    }
  }

  return null;
}

// Comprobar si el producto existe en el catálogo.
function buscarProducto(nombre, products) {
  if (!nombre) return null;

  return products.find(product =>
    product.nombre.toLowerCase() === nombre.toLowerCase()
  );
}

// Respuestas locales cuando Gemini no funciona.
function respuestaLocal(pregunta, products) {
  const q = pregunta.toLowerCase();

  if (/hola|buenas|hey|saludos/.test(q)) {
    return '¡Hola! Soy Nico, el asistente de Stock On. ¿Qué producto o mercado te gustaría conocer?';
  }

  if (/qué es stock on|que es stock on/.test(q)) {
    return 'Stock On es una plataforma que conecta información sobre productos agrícolas y mercados de diferentes países.';
  }

  if (/favorito/.test(q)) {
    return 'Puedes guardar productos como favoritos desde nuestro catálogo cuando hayas iniciado sesión.';
  }

  if (/pa[ií]s|mercado/.test(q)) {
    const paises = [...new Set(products.map(p => p.pais))];

    return `En nuestro catálogo encontrarás productos asociados a estos mercados: ${paises.join(', ')}.`;
  }

  if (/categor[ií]a/.test(q)) {
    const categorias = [...new Set(products.map(p => p.categoria))];

    return `Actualmente manejamos estas categorías: ${categorias.join(', ')}.`;
  }

  // Buscar coincidencias de productos existentes.
  const productoEncontrado = products.find(p =>
    q.includes(p.nombre.toLowerCase())
  );

  if (productoEncontrado) {
    return `${productoEncontrado.nombre} pertenece a la categoría ${productoEncontrado.categoria} y está asociado al mercado de ${productoEncontrado.pais}. ${productoEncontrado.descripcion}`;
  }

  // Detectar productos que no están en el catálogo.
  const productoBuscado = detectarProducto(pregunta);

  if (productoBuscado) {
    const producto = buscarProducto(productoBuscado, products);

    if (producto) {
      return `${producto.nombre} pertenece a la categoría ${producto.categoria} y está asociado al mercado de ${producto.pais}. ${producto.descripcion}`;
    }

    return `Por ahora, ${productoBuscado} no aparece en nuestro catálogo de Stock On. Sin embargo, contamos con otras opciones que podrían interesarte. ¡Te invito a descubrir nuestros productos!`;
  }

  return '¡Claro que puedo ayudarte! Puedes preguntarme por productos agrícolas, categorías o países disponibles en Stock On. ¿Qué te gustaría consultar?';
}

router.post('/nico', async (req, res) => {
  try {
    const pregunta = String(req.body.pregunta || '').trim();

    if (!pregunta) {
      return res.status(400).json({
        ok: false,
        respuesta: 'Escribe una pregunta para que pueda ayudarte.'
      });
    }

    if (pregunta.length > 1500) {
      return res.status(400).json({
        ok: false,
        respuesta: 'Tu pregunta es un poco extensa. ¿Puedes resumirla?'
      });
    }

    // Consultar el catálogo de MongoDB.
    const products = await Product.find()
      .select('nombre categoria pais descripcion disponible')
      .limit(100)
      .lean();

    // Intentar utilizar Gemini.
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('API_KEY_NOT_CONFIGURED');
      }

      const instrucciones = `
Eres Nico, el asistente virtual oficial de Stock On.

IDENTIDAD:
- Responde siempre en español.
- Utiliza un tono amable, natural y profesional.
- Representas a una plataforma especializada en productos agrícolas.

FUNCIONES:
- Orientar sobre productos agrícolas.
- Explicar categorías y mercados.
- Ayudar a explorar el catálogo.
- Responder preguntas generales sobre agricultura.

REGLAS:
- Consulta el catálogo proporcionado para responder sobre Stock On.
- No inventes productos, países, precios ni cantidades.
- Si preguntan por un producto que no está registrado, explica amablemente que no aparece en el catálogo.
- Si preguntan por automóviles, celulares, ropa u otros artículos ajenos a la actividad de Stock On, explica que la plataforma se especializa en productos agrícolas.
- Puedes recomendar explorar otros productos del catálogo.
- No afirmes que un producto está disponible si el campo disponible es falso.
- No inventes transacciones ni acciones realizadas.

CATÁLOGO ACTUAL:
${JSON.stringify(products, null, 2)}
`;

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: pregunta,
        config: {
          systemInstruction: instrucciones,
          temperature: 0.5,
          maxOutputTokens: 700
        }
      });

      const respuesta = response.text?.trim();

      if (!respuesta) {
        throw new Error('EMPTY_GEMINI_RESPONSE');
      }

      return res.json({
        ok: true,
        modo: 'gemini',
        respuesta
      });

    } catch (errorGemini) {
      console.warn(
        'Gemini no está disponible. Nico utilizará respuestas locales.'
      );

      return res.json({
        ok: true,
        modo: 'respaldo',
        respuesta: respuestaLocal(pregunta, products)
      });
    }

  } catch (error) {
    console.error('Error consultando el catálogo de Nico:', error);

    return res.status(500).json({
      ok: false,
      respuesta: 'En este momento no puedo consultar nuestro catálogo. Inténtalo nuevamente en un momento.'
    });
  }
});

module.exports = router;

