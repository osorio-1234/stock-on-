const router = require('express').Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const { requireAuth, requireAdmin } = require('../middleware/auth');
router.get('/productos', async (req,res,next) => {
  try {
    const products = await Product.find().sort({ pais:1, nombre:1 }).lean();
    let favorites = [];
    if (req.headers.authorization?.startsWith('Bearer ')) {
      try { const jwt = require('jsonwebtoken'); const p = jwt.verify(req.headers.authorization.slice(7), process.env.JWT_SECRET); const u = await User.findById(p.sub).select('favoritos'); favorites = u?.favoritos || []; } catch {}
    }
    res.json(products.map(p => ({ ...p, id:p._id.toString(), es_favorito:favorites.some(id => id.toString() === p._id.toString()) })));
  } catch(e) { next(e); }
});
router.post('/favoritos', requireAuth, async (req,res,next) => {
  try {
    const { producto_id } = req.body;
    if (!mongoose.isValidObjectId(producto_id)) return res.status(400).json({ message:'Producto no válido.' });
    const product = await Product.findById(producto_id);
    if (!product) return res.status(404).json({ message:'Producto no encontrado.' });
    const user = await User.findById(req.user._id);
    const exists = user.favoritos.some(id => id.toString() === producto_id);
    if (exists) user.favoritos = user.favoritos.filter(id => id.toString() !== producto_id); else user.favoritos.push(product._id);
    await user.save(); res.json({ ok:true, es_favorito:!exists });
  } catch(e) { next(e); }
});
router.post('/admin/productos', requireAuth, requireAdmin, async (req,res,next) => { try { const p = await Product.create(req.body); res.status(201).json(p); } catch(e) { next(e); } });
router.put('/admin/productos/:id', requireAuth, requireAdmin, async (req,res,next) => { try { const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true }); if(!p) return res.status(404).json({message:'Producto no encontrado.'}); res.json(p); } catch(e) { next(e); } });
router.delete('/admin/productos/:id', requireAuth, requireAdmin, async (req,res,next) => { try { const p = await Product.findByIdAndDelete(req.params.id); if(!p) return res.status(404).json({message:'Producto no encontrado.'}); await User.updateMany({}, { $pull:{favoritos:p._id} }); res.json({ok:true}); } catch(e) { next(e); } });
module.exports = router;
