"""Base de conocimiento del asistente Nico.

Cada entrada es (palabras_clave, respuesta). Se revisa en orden y se
devuelve la respuesta de la primera entrada cuyas palabras clave
aparezcan dentro de la pregunta.
"""

RESPUESTAS = [
    (
        ["hola", "buenas", "hey"],
        "Hola. Soy Nico, el asistente de Stock On. "
        "Puedes preguntarme sobre productos, mercados, "
        "favoritos o sobre cómo utilizar la plataforma.",
    ),
    (
        ["stock on", "que es stock", "qué es stock"],
        "Stock On es una plataforma académica que organiza "
        "información sobre productos agrícolas y mercados "
        "de diferentes países.",
    ),
    (
        ["favorito", "favoritos"],
        "Los favoritos son personales. Cuando inicias sesión, "
        "Stock On consulta la base de datos usando tu usuario "
        "para mostrar únicamente los productos que tú has guardado.",
    ),
    (
        ["producto", "productos", "catalogo", "catálogo"],
        "Puedes explorar los productos desde el catálogo y "
        "filtrarlos por nombre o país. También puedes marcar "
        "los que quieras conservar como favoritos.",
    ),
    (
        ["pais", "país", "paises", "países", "mercado"],
        "Actualmente Stock On trabaja con Colombia, Argentina, "
        "Brasil y Canadá. China está planteada como una futura "
        "ampliación.",
    ),
    (
        ["colombia"],
        "Colombia es el mercado principal de la propuesta "
        "actual y cuenta con productos como café, banano, "
        "aguacate, mango, papa y tomate.",
    ),
    (
        ["brasil"],
        "Brasil aporta productos tropicales y agrícolas al "
        "catálogo inicial de Stock On.",
    ),
    (
        ["argentina"],
        "Argentina forma parte de la cobertura actual y cuenta "
        "con productos como manzana, pera, uva y limón.",
    ),
    (
        ["canada", "canadá"],
        "Canadá forma parte de la cobertura actual y aporta "
        "productos agrícolas asociados a regiones de clima frío.",
    ),
    (
        ["ayuda", "help"],
        "Puedo orientarte sobre el catálogo, los favoritos, "
        "los mercados, el funcionamiento general de Stock On "
        "y algunas de sus funciones.",
    ),
]

RESPUESTA_POR_DEFECTO = (
    "No estoy seguro de haber entendido la pregunta. "
    "Puedes preguntarme, por ejemplo, qué es Stock On, "
    "cómo funcionan los favoritos, qué países están "
    "disponibles o cómo funciona el catálogo."
)


def buscar_respuesta(pregunta: str) -> str:
    pregunta = pregunta.lower()

    for palabras_clave, respuesta in RESPUESTAS:
        if any(palabra in pregunta for palabra in palabras_clave):
            return respuesta

    return RESPUESTA_POR_DEFECTO
