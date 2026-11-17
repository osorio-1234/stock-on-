const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, maxlength: 100 },
  categoria: { type: String, required: true, trim: true, maxlength: 80 },
  pais: { type: String, required: true, trim: true, maxlength: 80 },
  descripcion: { type: String, required: true, trim: true, maxlength: 600 },
  disponible: { type: Boolean, default: true },
  destacado: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);
