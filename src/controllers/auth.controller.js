const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {serialize} = require("cookie"); //permite comvertir la cookie para que la use la paginn

//esto es solo para el sistema de login y regitro

const login = async (req, res) => {
    try {
        const usuario = await Usuario.findOne({
            email: req.body.email //buscara al usuario por correo
        });
        if (!usuario) {
            return res.status(404).json({
                message: "Correo o contrasena no encontrado"
            });
        }

        //bcrypt es la libreria que se usa en el metodo compare que compara la contrasena
        // en la peticion con la bd que esta incriptada

        const passwordIsValid = await bcrypt.compare(req.body.password, usuario.password);
        if (!passwordIsValid) {
            return res.status(401).json({
                message: "Correo o contrasena no encontrado"
            });
        }
        const token = jwt.sign({ //dspues de que se encuntra la semilitud se crea el token
            id: usuario._id,
            email: usuario.email,
        }, process.env.SECRET, {
            expiresIn: 86400, //dos minutos que el token dudarara activado
        });
        const tokenSerialized = serialize('TokenValido', token, {
            maxAge: 60 * 60 * 1000,// dura una hora
            path: '/',
        })
        res.setHeader('token', tokenSerialized); //setea el token en el header
        res.cookie(tokenSerialized);
        res.status(200).send({
            message: "El usuario ha iniciado sesion exitosamente",
        });
        return res.status(200)
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo loguear el usuario",
            error: error.message
        });
    }
}

const register = async (req, res) => {
    try {
        const { nombre, apellido_paterno, apellido_materno, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const usuario = new Usuario({
            nombre,
            apellido_paterno,
            apellido_materno,
            email,
            password: hashedPassword
        });
        const usuarioExistente = await Usuario.findOne({email});
        if(usuarioExistente){
            return res.status(400).json({
                message: "El usuario ya existe"
            });
        }
        await usuario.save()

        const token = jwt.sign({ //dspues de que se encuntra la semilitud se crea el token
            id: usuario._id,
            email: usuario.email,
        }, process.env.SECRET, {
            expiresIn: 86400, //dos minutos que el token dudarara activado
        });
        const tokenSerialized = serialize('TokenValido', token, {
            maxAge: 60 * 60 * 1000,// dura una hora
            path: '/',
        })
        res.setHeader('token', tokenSerialized); //setea el token en el header
        res.cookie(tokenSerialized); //esto indica que se metio a la cookie
        res.status(200).send({
            message: "El usuario se ha registrado exitosamente",
        });
        return res.status(200)
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo crear el usuario",
            error: error.message
        });
    }
}

module.exports = {
    login,
    register
}