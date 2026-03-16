const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

router.post("/", controller.createDepartment);
router.get("/", controller.getDepartments);
module.exports = router;