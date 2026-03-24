const express = require("express");
const router = express.Router();

// Gender dropdown
router.get("/gender", (req, res) => {
  res.json(["test1","test2"]);
});

// Example: roles (optional)
router.get("/roles", (req, res) => {
  res.json(["admin", "user", "manager"]);
});

module.exports = router;