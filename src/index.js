require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./configs/db.config')
const app = express()

app.use(express.json())

const usuarioRouter = require('./routes/usuario.routes')
const {json} = require("express");

app.use('/usuarios', usuarioRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});