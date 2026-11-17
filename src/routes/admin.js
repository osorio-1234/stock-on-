const router = require('express').Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Message = require('../models/Message');
const { requireAuth, requireAdmin } = require('../middleware/auth');
router.get('/admin/resumen', requireAuth, requireAdmin, async(req,res,next)=>{try{const [productos,usuarios,mensajes]=await Promise.all([Product.countDocuments(),User.countDocuments(),Message.countDocuments({leido:false})]);res.json({productos,usuarios,mensajes_pendientes:mensajes});}catch(e){next(e);}});
module.exports=router;
