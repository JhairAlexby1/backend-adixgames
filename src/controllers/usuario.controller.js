const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario.model');
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const create = async (req, res) => { //crear usuario
    try{
        const { nombre, apellido_paterno, apellido_materno, email, password } = req.body;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const usuario = new Usuario({
            nombre,
            apellido_paterno,
            apellido_materno,
            email,
            password: hashedPassword
        });
        const usuarioExistente = await Usuario.findOne({email});
        if(usuarioExistente){ //en caso de que el usuario exita no agregara nada comprobando el email
            return res.status(400).json({
                message: "El usuario ya existe"
            });
        }
        await usuario.save()
        return res.status(201).json({ //creado con exito
            message: "Usuario creado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo crear el usuario",
            error: error.message
        });
    }
}

const index = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const skip = (page - 1) * limit;
        let usuarios
        let response = {
            message: "Usuarios obtenidos exitosamente"
        };
        if (page && limit) {
            usuarios = await Usuario.find({deleted: false}).skip(skip).limit(limit);
            const totalUsuarios = await Usuario.countDocuments({deleted: false}); //cantidad de usuarios en la bd mientras no esten eliminados
            const totalPages = Math.ceil(totalUsuarios / limit);
            response = {
                ...response,
                usuarios,
                total: totalUsuarios,
                totalPages,
                currentPage: parseInt(page)
            }
        }
        else {
            usuarios = await Usuario.find({deleted: false});
            response = {
                ...response,
                usuarios
            }
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo obtener los usuarios",
            error: error.message
        });
    }
}

const deletedById = async (req, res) => { //eliminar usuario
    try {
        const id = req.params.id;
        let usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }
        const usuarioEliminado = {deleted: true} //campo de auditoria para saber que dia se elimino o quien lo eimino, actualizo o creo
        await Usuario.findByIdAndUpdate(id, usuarioEliminado);
        return res.status(200).json({
            message: "Usuario eliminado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo eliminar el usuario",
            error: error.message
        });
    }
}

const getById = async (req, res) => { //para encontrar el usuario
    try {
        const id = req.params.id;
        const usuario = await Usuario.findOne({_id: id, deleted: false}); //busca por el id y que haya sido eliminado
        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }
        return res.status(200).json({
            message: "Usuario encontrado exitosamente",
            usuario
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo obtener el usuario",
            error: error.message
        });
    }
}

const partialUpdate = async (req, res) => { //actualizar usuario
try {
        const id = req.params.id;
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }
        let usuarioUpdated = { //reconoce los atributos que enviamos
            ...req.body,
            updated_at: new Date()
        }
        if (req.body.password)
            usuarioUpdated = {
            ...usuarioUpdated,
            password: await bcrypt.hash(usuarioUpdated.password, saltRounds)
            }
        await Usuario.findByIdAndUpdate(id, usuarioUpdated); //envia el id y usuario a actualizar
        return res.status(200).json({
            message: "Usuario actualizado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo actualizar el usuario",
            error: error.message
        });
    }
}

const totalUpdate = async (req, res) => {
    try {
        const id = req.params.id;
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }
        const usuarioUpdated = {
            nombre: req.body.nombre || null,
            apellido_paterno: req.body.apellido_paterno || null,
            apellido_materno: req.body.apellido_materno || null,
            email: req.body.email || null,
            password: req.body.password ? await bcrypt.hash(req.body.password, saltRounds) : null, //si le falta algun campo se volvera nulo
            updated_at: new Date()
        }
        await Usuario.findByIdAndUpdate(id, usuarioUpdated);
        return res.status(200).json({
            message: "Usuario actualizado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo actualizar el usuario",
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
