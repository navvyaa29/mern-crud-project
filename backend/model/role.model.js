const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  roleName: String,
  permissions: [String]
});

module.exports = mongoose.model("Role", roleSchema);