const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
  description: String,
}, { timestamps: true });

const Cities = mongoose.model("Cities", citySchema);
module.exports = { Cities };
