const rateLimit = require("express-rate-limit");

const accountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3, // limita cada IP a 6 peticiones por el tiempo definido con "windowMs"
    message: "Demasiados intentos, intentalo nuevamente en una hora"
});

module.exports = accountLimiter;