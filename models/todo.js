const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: { type: String, unique: true },
  description: { type: String, default: "" },
  date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Todo", todoSchema);
