from database import Base, SessionLocal, engine
from models import Producto


# Productos

productos = [

    {
        "nombre": "Banano",
        "categoria": "Frutas",
        "pais": "Colombia",
        "descripcion": "Fruta tropical de gran presencia en la producción agrícola colombiana.",
        "destacado": True
    },

    {
        "nombre": "Café",
        "categoria": "Cultivos",
        "pais": "Colombia",
        "descripcion": "Producto agrícola reconocido internacionalmente y asociado a diferentes regiones colombianas.",
        "destacado": True
    },

    {
        "nombre": "Aguacate",
        "categoria": "Frutas",
        "pais": "Colombia",
        "descripcion": "Fruta cultivada en diferentes zonas del país y presente en mercados nacionales e internacionales.",
        "destacado": True
    },

    {
        "nombre": "Mango",
        "categoria": "Frutas",
        "pais": "Colombia",
        "descripcion": "Fruta tropical producida en distintas regiones agrícolas.",
        "destacado": False
    },

    {
        "nombre": "Papa",
        "categoria": "Tubérculos",
        "pais": "Colombia",
        "descripcion": "Producto agrícola de consumo frecuente y de importancia dentro de la alimentación.",
        "destacado": False
    },

    {
        "nombre": "Tomate",
        "categoria": "Hortalizas",
        "pais": "Colombia",
        "descripcion": "Hortaliza utilizada ampliamente en diferentes preparaciones alimentarias.",
        "destacado": False
    },

    {
        "nombre": "Cacao",
        "categoria": "Cultivos",
        "pais": "Colombia",
        "descripcion": "Producto agrícola utilizado principalmente para la elaboración de chocolate y otros alimentos.",
        "destacado": True
    },

    {
        "nombre": "Piña",
        "categoria": "Frutas",
        "pais": "Colombia",
        "descripcion": "Fruta tropical cultivada en diferentes regiones del país.",
        "destacado": False
    },

    {
        "nombre": "Manzana",
        "categoria": "Frutas",
        "pais": "Argentina",
        "descripcion": "Fruta producida principalmente en regiones agrícolas de clima templado.",
        "destacado": True
    },

    {
        "nombre": "Pera",
        "categoria": "Frutas",
        "pais": "Argentina",
        "descripcion": "Producto frutícola de importancia comercial para diferentes mercados.",
        "destacado": False
    },

    {
        "nombre": "Uva",
        "categoria": "Frutas",
        "pais": "Argentina",
        "descripcion": "Fruta utilizada para consumo fresco y diferentes procesos alimentarios.",
        "destacado": True
    },

    {
        "nombre": "Limón",
        "categoria": "Frutas",
        "pais": "Argentina",
        "descripcion": "Fruta cítrica producida en distintas regiones del país.",
        "destacado": False
    },

    {
        "nombre": "Cebolla",
        "categoria": "Hortalizas",
        "pais": "Argentina",
        "descripcion": "Producto hortícola utilizado de manera frecuente en la alimentación.",
        "destacado": False
    },

    {
        "nombre": "Trigo",
        "categoria": "Cereales",
        "pais": "Argentina",
        "descripcion": "Uno de los cultivos agrícolas importantes dentro de la producción cerealera.",
        "destacado": True
    },

    {
        "nombre": "Maíz",
        "categoria": "Cereales",
        "pais": "Argentina",
        "descripcion": "Cereal utilizado en diferentes cadenas de alimentación y producción.",
        "destacado": True
    },

    {
        "nombre": "Naranja",
        "categoria": "Frutas",
        "pais": "Brasil",
        "descripcion": "Fruta cítrica de gran importancia dentro de la agricultura brasileña.",
        "destacado": True
    },

    {
        "nombre": "Piña",
        "categoria": "Frutas",
        "pais": "Brasil",
        "descripcion": "Fruta tropical cultivada en distintas zonas del país.",
        "destacado": False
    },

    {
        "nombre": "Papaya",
        "categoria": "Frutas",
        "pais": "Brasil",
        "descripcion": "Fruta tropical de consumo principalmente fresco.",
        "destacado": False
    },

    {
        "nombre": "Yuca",
        "categoria": "Tubérculos",
        "pais": "Brasil",
        "descripcion": "Producto agrícola utilizado dentro de diferentes cadenas alimentarias.",
        "destacado": True
    },

    {
        "nombre": "Café",
        "categoria": "Cultivos",
        "pais": "Brasil",
        "descripcion": "Producto agrícola de gran importancia dentro del mercado brasileño.",
        "destacado": True
    },

    {
        "nombre": "Cacao",
        "categoria": "Cultivos",
        "pais": "Brasil",
        "descripcion": "Cultivo tropical utilizado para la elaboración de diferentes productos alimentarios.",
        "destacado": False
    },

    {
        "nombre": "Soja",
        "categoria": "Cultivos",
        "pais": "Brasil",
        "descripcion": "Cultivo agrícola utilizado en diferentes cadenas alimentarias y productivas.",
        "destacado": True
    },

    {
        "nombre": "Arándanos",
        "categoria": "Frutas",
        "pais": "Canadá",
        "descripcion": "Fruto asociado a regiones de clima frío y utilizado en diferentes alimentos.",
        "destacado": True
    },

    {
        "nombre": "Fresa",
        "categoria": "Frutas",
        "pais": "Canadá",
        "descripcion": "Fruta cultivada en diferentes sistemas agrícolas y utilizada principalmente para consumo.",
        "destacado": False
    },

    {
        "nombre": "Zanahoria",
        "categoria": "Hortalizas",
        "pais": "Canadá",
        "descripcion": "Hortaliza cultivada y consumida en diferentes regiones.",
        "destacado": False
    },

    {
        "nombre": "Cebolla",
        "categoria": "Hortalizas",
        "pais": "Canadá",
        "descripcion": "Producto hortícola utilizado ampliamente en alimentación.",
        "destacado": False
    },

    {
        "nombre": "Papa",
        "categoria": "Tubérculos",
        "pais": "Canadá",
        "descripcion": "Producto agrícola adaptado a diferentes zonas productoras del país.",
        "destacado": True
    },

    {
        "nombre": "Trigo",
        "categoria": "Cereales",
        "pais": "Canadá",
        "descripcion": "Cereal de importancia dentro de la producción agrícola canadiense.",
        "destacado": True
    }

]


Base.metadata.create_all(bind=engine)

db = SessionLocal()


try:

    cantidad = db.query(Producto).count()

    if cantidad == 0:

        for datos in productos:

            db.add(
                Producto(
                    **datos,
                    disponible=True
                )
            )

        db.commit()

        print(
            f"{len(productos)} productos agregados correctamente."
        )

    else:

        print(
            f"La base de datos ya tiene {cantidad} productos."
        )

finally:

    db.close()