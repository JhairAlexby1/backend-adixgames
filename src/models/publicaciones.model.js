const mongoose = require('mongoose');

const PublicacionSchema = new mongoose.Schema({
    titulo: {
        int: id,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fecha_publicacion: {
        type: Date,
        default: new Date()
    },
    fotografia: {
        type: BinData, //pediente la revision de este tipo de dato
        default: null
    },
});

module.exports = mongoose.model('Publicacion', PublicacionSchema);