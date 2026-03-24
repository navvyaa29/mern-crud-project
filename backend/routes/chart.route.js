const express = require("express");
const router = express.Router();

// Example dynamic data
router.get("/sales", (req, res) => {
  res.json([
    { label: "Jan", value: 40 },
    { label: "Feb", value: 60 },
    { label: "Mar", value: 30 },
    { label: "Apr", value: 80 }
  ]);
});

module.exports = router;