const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
function tokenFor(user) { return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }); }
router.post('/registro', async (req,res,next) => {
  try {
    const usuario = String(req.body.usuario || '').trim(); const password = String(req.body.password || '');
    if (usuario.length < 3 || usuario.length > 50) return res.status(400).json({ message: 'El usuario debe tener entre 3 y 50 caracteres.' });
    if (password.length < 8) return res.status(400).json({ message: 'La contraseña debe tener mínimo 8 caracteres.' });
    if (await User.exists({ usuario })) return res.status(409).json({ message: 'Ese usuario ya existe.' });
    const user = await User.create({ usuario, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ ok:true, usuario_id:user._id, usuario:user.usuario });
  } catch(e) { next(e); }
});
router.post('/login', async (req,res,next) => {
  try {
    const usuario = String(req.body.usuario || '').trim(); const password = String(req.body.password || '');
    const user = await User.findOne({ usuario }).select('+password');
    if (!user || !user.activo || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message:'Usuario o contraseña incorrectos.' });
    res.json({ ok:true, token:tokenFor(user), usuario_id:user._id, usuario:user.usuario, es_admin:user.es_admin });
  } catch(e) { next(e); }
});
router.get('/me', requireAuth, (req,res) => res.json({ usuario:req.user.usuario, usuario_id:req.user._id, es_admin:req.user.es_admin }));
module.exports = router;
