const express = require('express');
const router = express.Router();
const invcontroller = require('../controllers/InvController');
const authutils = require('../Middleware/authUtils');


function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if(!token){
      return res.status(401).json({error: "Unauthorized"});
  }
  const decodedtoken = authutils.verifyToken(token);
  if(!decodedtoken){
      return res.status(401).json({error: 'Unauthorized'});
  }
  req.user = decodedtoken;
  next();
}

  //1. Agregar nuevo producto
  router.post('/', authenticate, (req, res)=> {
      const { nombre, descripcion, cantidad, precio } = req.body;
      const newInv = invcontroller.createInv(nombre, descripcion, cantidad, precio);
      res.status(201).json(newInv);
  });
  //2. Obtener todos los productos
  router.get('/', authenticate, (req,res) => {
    res.json(invcontroller.getAllInv());
  });

  //3. Obtener un producto por su ID
  router.get('/:id', authenticate, (req, res)=> {
    const idProducto = parseInt(req.params.id);
    const productoEncontrado = invcontroller.getInvID(idProducto);

    if (productoEncontrado) {
      res.json(productoEncontrado);
    } else {
      res.status(404).json({ error: 'No se encontro la tarea' });
    }
  });

  //4. Actualizar la información de un producto
  router.put('/:id', authenticate, (req,res)=>{
    const idProducto = parseInt(req.params.id) //id a numero
    const { nombre, descripcion, cantidad, precio } = req.body;
    const productoEncontrado = invcontroller.updateInv(idProducto, nombre, descripcion, cantidad, precio); 
    if (productoEncontrado){
        res.json(productoEncontrado);
    } else {
        res.status(404).json({ error: 'No se encontro la tarea 2'  });
    } 
  });

  //5. Eliminar un producto
  router.delete('/:id', authenticate, (req,res)=>{
    const idProducto = parseInt(req.params.id);
    const productoEncontrado = invcontroller.deleteInv(idProducto);
    if (productoEncontrado) {
      /*const eliminarProd = cadena.splice(productoEncontrado, 1);
      res.json(eliminarProd[0]);
      res.status(202).json({ ola: 'se elimino' });*/
      res.json(productoEncontrado);
    } else {
      
      res.status(404).json({ error: 'No se encontro el producto' });
    }
  });

  //6. Buscar productos por su nombre
  router.get('/buscar/:nombre', authenticate, (req, res) => {
    const { nombre } = req.params;
    const productoEncontrado = invcontroller.getInvNombre(nombre);
    console.log(productoEncontrado);
    if (productoEncontrado) {
        res.json(productoEncontrado);
    } else {
        res.status(404).send('Producto no encontrado');
    }
  });

  //7. Cálculo del valor total de inventario
  router.get('/costo/total', authenticate, (req, res) => {
    const valorTotal = invcontroller.getValorTotal();
    res.json({ valorTotal });
  });

  //8. Ordenar productos por precio
  router.get('/ordenar/precio', authenticate, (req, res) => {
    const { producto } = req.query; // Expect 'asc' or 'desc'
    const ordProducto = invcontroller.ordenarPrecio(producto);
    res.json(ordProducto);
  });

  //9. Filtrar productos por cantidad en stock
  router.get('/filtrar/producto', authenticate, (req, res) => {
    const { stock } = req.query;
    const productoFiltrado = invcontroller.filtrarPorStock(stock);
    res.json(productoFiltrado);
});

module.exports = router;

