const express = require("express");
const router = express.Router();

const controller = require("../controller/controller");

router.post("/", controller.createProject);
router.get("/", controller.getProjects);
module.exports = router;