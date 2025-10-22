const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Hindu", "Muslim"
  description: String,
}, { timestamps: true });

const Countries = mongoose.model("Countries", countrySchema);
module.exports = { Countries };
