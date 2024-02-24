const bcrypt = require('bcrypt');
const Usuario = require('../models/publicacion.model');
const { deletedById } = require('./usuario.controller');
const { get } = require('mongoose');
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const create = async (req, res) => { //crear videojuego
    try{
        const { nombre, genero, plataforma, precio } = req.body;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(precio, salt);
        const videojuego = new Videojuego({
            nombre,
            genero,
            plataforma,
            precio: hashedPassword
        });
        const videojuegoExistente = await Videojuego.findOne({nombre});
        if(videojuegoExistente){ //en caso de que el videojuego exita no agregara nada comprobando el nombre
            return res.status(400).json({
                message: "El videojuego ya existe"
            });
        }
        await videojuego.save()
        return res.status(201).json({ //creado con exito
            message: "Videojuego creado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo crear el videojuego",
            error: error.message
        });
    }
}

const index = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const skip = (page - 1) * limit;
        let videojuegos
        let response = {
            message: "Videojuegos obtenidos exitosamente"
        };
        if (page && limit) {
            videojuegos = await Videojuego.find({deleted: false}).skip(skip).limit(limit);
            const totalVideojuegos = await Videojuego.countDocuments({deleted: false}); //cantidad de videojuegos en la bd mientras no esten eliminados
            const totalPages = Math.ceil(totalVideojuegos / limit);
            response = {
                ...response,
                videojuegos,
                total: totalVideojuegos,
                totalPages,
                currentPage: parseInt(page)
            }
        }
        else {
            videojuegos = await Videojuego.find({deleted: false});
            response = {
                ...response,
                videojuegos
            }
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "No se pudieron obtener los videojuegos",
            error: error.message
        });
    }
}

const deletedById = async (req, res) => { //eliminar videojuegos
    try {
        const { id } = req.params;
        let Videojuego = await Videojuego.findById(id);
        if (!Videojuego) {
            return res.status(404).json({
                message: "El videojuego no existe"
            });
        }
        videojuego = {...Videojuego, deleted: true, deletedAt: new Date()}; //auditoria para saber que dia se elimino
        await Videojuego.save();
        return res.status(200).json({
            message: "Videojuego eliminado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo eliminar el videojuego",
            error: error.message
        });
    }
}

const getById = async (req, res) => { //obtener videojuego por id
    try {
        const { id } = req.params;
        const videojuego = await Videojuego.findById(id);
        if (!videojuego) {
            return res.status(404).json({
                message: "Videojuego no encontrado"
            });
        }
        return res.status(200).json({
            message: "Videojuego obtenido exitosamente",
            videojuego
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo obtener el videojuego",
            error: error.message
        });
    }
}

const partialUpdate = async (req, res) => { //actualizar videojuego
    try{
        const id = req.params.id;
        const videojuego = await Videojuego.findById(id);
        if (!videojuego) {
            return res.status(404).json({
                message: "Videojuego no encontrado"
            });
        }
        let videojuegoUpdate = {
            ...videojuego._doc,
            update_at: new Date()
        }
        if (req.body.password)
        videojuegoUpdate = {
            ...videojuegoUpdate,
            password: await bcrypt.hash(req.body.password, saltRounds)
        }
        await Videojuego.findByIdAndUpdate(id, videojuegoUpdate);
        return res.status(200).json({
            message: "Videojuego actualizado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo actualizar el videojuego",
            error: error.message
        });
    }
}

const totalUpdate = async (req, res) => { //actualizar videojuego
    try{
        const id = req.params.id;
        const videojuego = await Videojuego.findById(id);
        if (!videojuego) {
            return res.status(404).json({
                message: "Videojuego no encontrado"
            });
        }

        const videojuegoUpdate = {
            nombre: req.body.nombre || null,
            genero: req.body.genero || null,
            plataforma: req.body.plataforma || null,
            precio: req.body.precio || null,
            updated_at: new Date()
        }
        await Videojuego.findByIdAndUpdate(id, videojuegoUpdate);
        return res.status(200).json({
            message: "Videojuego actualizado exitosamente"
        });
        
    }catch (error) {
        return res.status(500).json({
            message: "No se pudo actualizar el videojuego",
            error: error.message
        });
    }
}

module.exports = {
    create,
    index,
    deletedById,
    getById,
    partialUpdate,
    totalUpdate
}