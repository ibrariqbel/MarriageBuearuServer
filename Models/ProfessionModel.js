const mongoose = require("mongoose");

const ProfessionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Hindu", "Muslim"
  description: String,
}, { timestamps: true });

const Professions = mongoose.model("Professions", ProfessionSchema);
module.exports = { Professions };
