const mongoose = require("mongoose");

const religionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Hindu", "Muslim"
  description: String,
}, { timestamps: true });

const Religions = mongoose.model("Religions", religionSchema);
module.exports = { Religions };
