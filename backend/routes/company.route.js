const express = require("express");
const router = express.Router();

const controller = require("../controller/controller");

router.post("/", controller.createCompany);
router.get("/", controller.getCompanies);

module.exports = router;