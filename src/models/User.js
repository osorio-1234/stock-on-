const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 50 },
  password: { type: String, required: true, select: false },
  es_admin: { type: Boolean, default: false },
  activo: { type: Boolean, default: true },
  favoritos: [{ type: require('mongoose').Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
