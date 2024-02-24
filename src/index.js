require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./configs/db.config')
const app = express()
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    }
))//Esto permite que la api pueda ser consumida por cualquier frontend
//Tambien se usa para dar acceso al header de la peticion
app.use(cookieParser()) //Esto permite que la api pueda leer la informacion de las cookies

const usuarioRouter = require('./routes/usuario.routes')
const authRouter = require('./routes/auth.routes')
const publicacionRouter = require('./routes/publicaciones.routes')
const videojuegosRouter = require('./routes/videojuegos.routes')


app.use('/usuarios', usuarioRouter);
app.use('/auth', publicacionRouter);
app.use('/auth', videojuegosRouter);
app.use('/auth', authRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});