const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: String,

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  }

});

module.exports = mongoose.model("Project", projectSchema);