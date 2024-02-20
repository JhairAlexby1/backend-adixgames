const {verify} = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.TokenValido;
        if (!token) {
            return res.status(401).json({
               message: "No se pudo autentificar el usuario"
            });
        }
        const decoded = verify(token, process.env.SECRET);
        req.usuario = decoded.usuario;
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Hubo un error al autentificar el usuario",
        });
    }
}

module.exports = {
    verifyToken
}