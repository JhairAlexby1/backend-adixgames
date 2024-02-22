const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario.model');
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const create = async (req, res) => { //crear publicacion
    try{
        const { titulo, contenido, autor, fotografia } = req.body;
        const publicacion = new Publicacion({
            titulo,
            contenido,
            autor,
            fotografia
        });

        await publicacion.save()
        return res.status(201).json({ //creado con exito
            message: "Publicacion creada exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo crear la publicacion",
            error: error.message
        });
    }
}

const index = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const skip = (page - 1) * limit;
        let publicaciones
        let response = {
            message: "Publicaciones obtenidas exitosamente"
        };
        if (page && limit) {
            publicaciones = await Publicacion.find({deleted: false}).skip(skip).limit(limit);
            const totalPublicaciones = await Publicacion.countDocuments({deleted: false}); //cantidad de publicaciones en la bd mientras no esten eliminados
            const totalPages = Math.ceil(totalPublicaciones / limit);
            response = {
                ...response,
                publicaciones,
                total: totalPublicaciones,
                totalPages,
                currentPage: parseInt(page)
            }
        }
        else {
            publicaciones = await Publicacion.find({deleted: false});
            response = {
                ...response,
                publicaciones
            }
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "No se pudieron obtener las publicaciones :(",
            error: error.message
        });
    }
}

const deletedById = async (req, res) => { //eliminar publicacion
    try {
        const id = req.params.id;
        let publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({
                message: "Publicacion no encontrada"
            });
        }
        publicacion.deleted = true;
        await publicacion.save();
        return res.status(200).json({
            message: "Publicacion eliminada exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo eliminar la publicacion",
            error: error.message
        });
    }
}

const getById = async (req, res) => { //para encontrar la publicacion
    try {
        const id = req.params.id;
        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({
                message: "Publicacion no encontrada"
            });
        }
        return res.status(200).json({
            message: "Publicacion encontrada exitosamente",
            publicacion
        });
        } catch (error) {
        return res.status(500).json({
            message: "No se pudo obtener la publicacion",
            error: error.message
        });
    }
}

const partialUpdate = async (req, res) => { //actualizar publicacion
    try {
        const id = req.params.id;
        const { titulo, contenido, autor, fotografia } = req.body;
        let publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({
                message: "Publicacion no encontrada"
            });
        }
        publicacion = {...publicacion, titulo, contenido, autor, fotografia};
        await publicacion.save();
        return res.status(200).json({
            message: "Publicacion actualizada exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo actualizar la publicacion",
            error: error.message
        });
    }
}

const totalUpdate = async (req, res) => { //actualizar publicacion
    try {
        const id = req.params.id;
        const { titulo, contenido, autor, fotografia } = req.body;
        let publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({
                message: "Publicacion no encontrada"
            });
        }
        publicacion = {...publicacion, titulo, contenido, autor, fotografia};
        await publicacion.save();
        return res.status(200).json({
            message: "Publicacion actualizada exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo actualizar la publicacion",
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



