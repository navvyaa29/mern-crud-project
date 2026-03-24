const express = require('express');
const router = express.Router();
const controller = require("../controller/controller");
const registerSchema = require("../model/register.model");
const verifyToken = require("../middleware/auth.middleware");

router.get('/', verifyToken, (req, res) => {
  controller.read(req, res, registerSchema);
});

router.post('/', verifyToken, (req, res) => {
  controller.create(req, res, registerSchema);
});

router.put('/:id', verifyToken, (req, res) => {
  controller.update(req, res, registerSchema);
});

router.delete('/:id', verifyToken, (req, res) => {
  controller.remove(req, res, registerSchema);
});

module.exports = router;