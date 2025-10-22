const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Hindu", "Muslim"
  description: String,
}, { timestamps: true });

const Communities = mongoose.model("Communities", CommunitySchema);
module.exports = { Communities };
