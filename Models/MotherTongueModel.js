const mongoose = require("mongoose");

const MotherTongueSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Hindu", "Muslim"
  description: String,
}, { timestamps: true });

const MotherTongues = mongoose.model("MotherTongues", MotherTongueSchema);
module.exports = { MotherTongues };
