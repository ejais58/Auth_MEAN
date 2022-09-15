
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

//Crear el servidor express
const app = express();

//Base de Datos
dbConnection();

//Directorio público
app.use(express.static('public'))

//Cors
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));

app.listen(process.env.PORT, () =>{
    console.log(`servidor corriendo en el puerto ${ process.env.PORT }`);
});