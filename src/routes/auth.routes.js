const express = require('express');
const router = express.Router();
const { login, register} = require('../controllers/auth.controller');
const accountLimiter = require('../helpers/limiter.helper');

router.post('/login', accountLimiter, login);
router.post('/register', register);

module.exports = router;