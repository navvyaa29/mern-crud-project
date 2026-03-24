const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const verifyToken = require("../middleware/auth.middleware");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Protected profile data",
    user: req.user
  });
});

module.exports = router;