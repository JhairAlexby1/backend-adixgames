const express = require('express');
const { create, index, deletedById, getById, partialUpdate, totalUpdate } = require('../controllers/usuario.controller');
const router = express.Router();
const {verifyToken} = require('../middlewares/auth.middleware');

router.post("/", create);
router.get("/", index);
//las rutas del crud tienen que estar protegidas por las modificaciones de la bd
router.delete("/:id", verifyToken, deletedById);
router.get("/:id", verifyToken, getById);
router.patch("/:id", verifyToken, partialUpdate);
router.put("/:id", verifyToken, totalUpdate);

module.exports = router;