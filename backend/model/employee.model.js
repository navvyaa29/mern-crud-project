const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "register"
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role"
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address"
  }
});

module.exports = mongoose.model("Employee", employeeSchema);