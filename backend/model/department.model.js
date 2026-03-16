const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: String,

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  }

});

module.exports = mongoose.model("Department", departmentSchema);