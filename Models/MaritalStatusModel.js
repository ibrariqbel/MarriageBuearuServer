const mongoose = require("mongoose");

const MaritalStatusSchema = new mongoose.Schema({
  
  name: { type: String, required: true, unique: true }, // e.g., "Hindu", "Muslim"
  description: String,
}, { timestamps: true });

const MaritalStatus = mongoose.model("MaritalStatus", MaritalStatusSchema);
module.exports = { MaritalStatus };
