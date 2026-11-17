const router = require('express').Router();
const Message = require('../models/Message');
const { requireAuth, requireAdmin } = require('../middleware/auth');
router.post('/contacto', async (req,res,next) => { try {
  const nombre=String(req.body.nombre||'').trim(), correo=String(req.body.correo||'').trim(), mensaje=String(req.body.mensaje||'').trim();
  if(nombre.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || mensaje.length<5) return res.status(400).json({message:'Revisa el nombre, correo y mensaje.'});
  await Message.create({nombre,correo,mensaje}); res.status(201).json({ok:true,message:'Mensaje recibido. Gracias por escribirnos.'});
} catch(e){next(e);} });
router.get('/admin/contacto', requireAuth, requireAdmin, async(req,res,next)=>{try{res.json(await Message.find().sort({createdAt:-1}).lean());}catch(e){next(e);}});
router.patch('/admin/contacto/:id/leido', requireAuth, requireAdmin, async(req,res,next)=>{try{const m=await Message.findByIdAndUpdate(req.params.id,{leido:true},{new:true});if(!m)return res.status(404).json({message:'Mensaje no encontrado.'});res.json(m);}catch(e){next(e);}});
module.exports=router;
