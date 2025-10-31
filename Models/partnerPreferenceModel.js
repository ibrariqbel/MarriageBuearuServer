const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Schema ko define karein

const partnerPreferenceSchema = new mongoose.Schema(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      index: true,
      unique: true // Ek profile ki ek hi preference honi chahiye
    },
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 100 },
    },
    heightRange: {
      min: { type: Number }, // Min height in cm
      max: { type: Number }, // Max height in cm
    },
    // Inko String Array ki jaga ObjectId Array banayein
    maritalStatusIds: [{
      type: Schema.Types.ObjectId,
      ref: "MaritalStatus",
    }],
    religionIds: [{
      type: Schema.Types.ObjectId,
      ref: "Religions",
    }],
    motherTongueIds: [{
      type: Schema.Types.ObjectId,
      ref: "MotherTongues",
    }],
    communityIds: [{
      type: Schema.Types.ObjectId,
      ref: "Communities",
    }],
    countryIds: [{
      type: Schema.Types.ObjectId,
      ref: "Countries",
    }],
    educationIds: [{
      type: Schema.Types.ObjectId,
      ref: "EducationLevels"
    }],
    professionIds: [{
        type: Schema.Types.ObjectId,
        ref: "Professions"
    }]
  },
  { timestamps: true }
);

const PartnerPreference = mongoose.model(
  "PartnerPreference",
  partnerPreferenceSchema
);

module.exports = { PartnerPreference };