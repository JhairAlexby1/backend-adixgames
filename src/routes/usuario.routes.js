const express = require('express');
const { create, index, deletedById, getById, partialUpdate, totalUpdate } = require('../controllers/usuario.controller');
const router = express.Router();

router.post("/", create);
router.get("/", index);
router.delete("/:id", deletedById);
router.get("/:id", getById);
router.patch("/:id", partialUpdate);
router.put("/:id", totalUpdate);

module.exports = router;