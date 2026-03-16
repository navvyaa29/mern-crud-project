const express = require('express');
const router = express.Router();
const controller = require("../controller/controller");
const registerSchema =require("../model/register.model");
// GET request
router.get('/', (req, res) => {
  controller.read(req,res,registerSchema);
});

// POST request
router.post('/', (req, res) => {
  controller.create(req,res,registerSchema);
});

// PUT request
router.put('/:id', (req, res) => {
 controller.update(req,res,registerSchema);
});

// DELETE request
router.delete('/:id', (req, res) => {
  controller.remove(req,res,registerSchema);
});

module.exports = router;