const mongoose = require("mongoose");

const EducationLevelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Hindu", "Muslim"
  description: String,
}, { timestamps: true });

const EducationLevels = mongoose.model("EducationLevels", EducationLevelSchema);
module.exports = { EducationLevels };
