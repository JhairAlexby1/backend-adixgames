const mongoose = require('mongoose');

const PublicacionSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fecha_publicacion: {
        type: Date,
        default: new Date()
    },
    fotografia: {
        type: String, //pediente la revision de este tipo de dato
        default: null
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleted_at: {
        type: Date,
        default: null
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: null
    },
    deleted_by: {
        type: String,
        default: null
    },
    updated_by: {
        type: String,
        default: null
    },
    created_by: {
        type: String,
        required: true,
        ref: 'Usuario',
        default: null
    },
});

module.exports = mongoose.model('Publicacion', PublicacionSchema);