const jwt = require('jsonwebtoken');
const User = require('../models/User');
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Inicia sesión para continuar.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user || !user.activo) return res.status(401).json({ message: 'La sesión ya no es válida.' });
    req.user = user;
    next();
  } catch { return res.status(401).json({ message: 'Token inválido o vencido.' }); }
}
function requireAdmin(req, res, next) {
  if (!req.user?.es_admin) return res.status(403).json({ message: 'No tienes permisos de administrador.' });
  next();
}
module.exports = { requireAuth, requireAdmin };
