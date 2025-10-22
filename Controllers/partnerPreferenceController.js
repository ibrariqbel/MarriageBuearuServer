const { PartnerPreference } = require("../Models/partnerPreferenceModel");
const { Profile } = require("../Models/profileModel");
const { messageHandler } = require("../utils/messageHandler");

// Create or Update Partner Preference for a Profile
const createOrUpdatePreference = async (req, res) => {
  try {
    const { profileId } = req.params;
    const userId = req.userId;

    // 1. Check if profile exists and belongs to the user
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return messageHandler(res, 404, "Profile not found");
    }
    if (profile.userID.toString() !== userId) {
      return messageHandler(res, 403, "You do not own this profile");
    }

    // 2. Data from body (using corrected model fields)
    const {
      ageRange, heightRange, maritalStatusIds, religionIds,
      motherTongueIds, communityIds, countryIds, educationIds, professionIds
    } = req.body;

    const preferenceFields = {
      profileId,
      ageRange, heightRange, maritalStatusIds, religionIds,
      motherTongueIds, communityIds, countryIds, educationIds, professionIds
    };

    // 3. Find existing preference or create new one
    let preference = await PartnerPreference.findOne({ profileId });

    if (preference) {
      // Update
      preference = await PartnerPreference.findOneAndUpdate(
        { profileId },
        { $set: preferenceFields },
        { new: true }
      );
      return messageHandler(res, 200, "Preferences updated", preference);
    } else {
      // Create
      preference = await PartnerPreference.create(preferenceFields);
      return messageHandler(res, 201, "Preferences created", preference);
    }

  } catch (error) {
    return messageHandler(res, 500, `Preference Server Error: ${error.message}`);
  }
};

// Get Partner Preference for a Profile
const getPreference = async (req, res) => {
  try {
    const { profileId } = req.params;
    const preference = await PartnerPreference.findOne({ profileId })
      .populate('maritalStatusIds', 'name')
      .populate('religionIds', 'name')
      .populate('communityIds', 'name')
      .populate('motherTongueIds', 'name')
      .populate('countryIds', 'name')
      .populate('educationIds', 'name')
      .populate('professionIds', 'name');

    if (!preference) {
      return messageHandler(res, 404, "Preferences not found for this profile");
    }
    return messageHandler(res, 200, "Preferences found", preference);
  } catch (error) {
    return messageHandler(res, 500, `Get Preference Error: ${error.message}`);
  }
};

module.exports = {
  createOrUpdatePreference,
  getPreference,
};