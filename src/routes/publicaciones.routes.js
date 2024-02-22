const express = require('express');
const { create, index, deletedById, getById, partialUpdate, totalUpdate } = require('../controllers/publicaciones.controller');
const router = express.Router();
const {verifyToken} = require('../middlewares/auth.middleware');

router.post("/", create);
router.get("/", index);
router.delete("/:id", verifyToken, deletedById);
router.get("/:id", verifyToken, getById);
router.patch("/:id", verifyToken, partialUpdate);
router.put("/:id", verifyToken, totalUpdate);

module.exports = router;