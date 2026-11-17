require('dotenv').config();
const mongoose=require('mongoose'); const bcrypt=require('bcryptjs'); const User=require('./models/User'); const Product=require('./models/Product');
const products=[
 ['Café','Bebidas y cultivos','Colombia','Producto agrícola representativo de Colombia, reconocido por su calidad y presencia en mercados internacionales.'],
 ['Banano','Frutas','Colombia','Fruta tropical cultivada en distintas regiones del país y destinada al mercado nacional e internacional.'],
 ['Aguacate','Frutas','Colombia','Fruta de creciente demanda en mercados internacionales.'],
 ['Mango','Frutas','Colombia','Fruta tropical de consumo fresco y múltiples usos alimentarios.'],
 ['Papa','Tubérculos','Colombia','Cultivo fundamental para la alimentación y la economía agrícola.'],
 ['Tomate','Hortalizas','Colombia','Hortaliza de consumo cotidiano en hogares y comercios.'],
 ['Manzana','Frutas','Argentina','Fruta producida en regiones agrícolas argentinas.'],
 ['Pera','Frutas','Argentina','Fruta de clima templado con presencia en la producción argentina.'],
 ['Uva','Frutas','Argentina','Producto agrícola utilizado para consumo fresco y transformación.'],
 ['Limón','Frutas','Argentina','Cítrico utilizado en alimentación y diferentes industrias.'],
 ['Soja','Granos','Brasil','Cultivo de gran importancia para la producción agrícola brasileña.'],
 ['Naranja','Frutas','Brasil','Fruta cítrica de amplia producción y consumo.'],
 ['Maíz','Granos','Brasil','Cereal utilizado para alimentación humana, animal e industria.'],
 ['Arándano','Frutas','Canadá','Fruta cultivada en regiones de clima templado y frío.'],
 ['Trigo','Granos','Canadá','Cereal importante para la producción de harinas y alimentos.']
].map(([nombre,categoria,pais,descripcion])=>({nombre,categoria,pais,descripcion,disponible:true}));
(async()=>{try{await mongoose.connect(process.env.MONGODB_URI);await Product.deleteMany({});await Product.insertMany(products);const usuario=process.env.ADMIN_USER||'admin';const clave=process.env.ADMIN_PASSWORD;if(!clave)throw new Error('Configura ADMIN_PASSWORD en .env antes de ejecutar el seed.');const hash=await bcrypt.hash(clave,12);await User.findOneAndUpdate({usuario},{$set:{password:hash,es_admin:true,activo:true}},{upsert:true,new:true});console.log(`Seed completado: ${products.length} productos y administrador ${usuario}.`);}catch(e){console.error(e);process.exitCode=1;}finally{await mongoose.disconnect();}})();
