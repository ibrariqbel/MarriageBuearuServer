const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  firstName: String,
  lastName: String,
  DOB: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  bio: { type: String, maxlength: 1000 },
  heightFeet: { type: String }, // e.g., "5'10\""
  maritalStatusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MaritalStatus",
  },
  religionId: { type: mongoose.Schema.Types.ObjectId, ref: "Religions" },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: "Communities" },
  motherTongeId: { type: mongoose.Schema.ObjectId, ref: "MotherTongues" },
  countryId: { type: mongoose.Schema.ObjectId, ref: "Countries" },
  cityId: { type: mongoose.Schema.ObjectId, ref: "Cities" },
  educationId: { type: mongoose.Schema.ObjectId, ref: "EducationLevels" },
  professionId: { type: mongoose.Schema.ObjectId, ref: "Professions" },
  profileImageUrl: { type: String },
  isVerified: { type: Boolean, default: false },
});
const Profile = mongoose.model("Profile", profileSchema);

module.exports = { Profile };
