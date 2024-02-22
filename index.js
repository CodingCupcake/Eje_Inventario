const express = require('express');
const bodyParser = require('body-parser');
const todoRoutes = require('./rutas/InvRoutes');
const authMiddleware = require('./Middleware/authMiddleware');
const authUtils = require('./Middleware/authUtils');

const app = express();
app.use(bodyParser.json());

let usuarios = [
    {id: 1, nombre: 'admin', contraseña: 'admin'},
    {id: 2, nombre: 'Panque', contraseña: 'cupcake'},
    {id: 3, nombre: 'Segundo', contraseña: 'Waza'},
];

app.post('/login', (req, res) =>{
    //const username = req.body.username;
    //const password = req.body.password;
    const {username, password} = req.body

    const userF = usuarios.find(user => user.nombre === username && user.contraseña === password)

    if(userF){
        const token = authUtils.generateToken({id: userF.id, username: userF.username});
        res.json({token});
    }else{
        res.json(401).json({error: "Unauthorized"});
    }
});

app.use(authMiddleware);

// Rutas
app.use('/api/inventario', todoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

