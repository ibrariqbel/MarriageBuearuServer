const { Profile } = require("../Models/profileModel");
const { User } = require("../Models/userModel");
const { messageHandler } = require("../utils/messageHandler");
const { uploadToCloud } = require("../utils/cloudinary");
const { MaritalStatus } = require("../Models/MaritalStatusModel");
const { Religions } = require("../Models/religionModel");
const { Communities } = require("../Models/CommunityModel");
const { MotherTongues } = require("../Models/MotherTongueModel");
const { Countries } = require("../Models/CountryModel");
const { EducationLevels } = require("../Models/EducationLevelModel");
const { Professions } = require("../Models/ProfessionModel");

const createProfile = async (req, res) => {
  try {
    const userID = req.userId;
    const user = await User.findById(userID);
    if (!user) {
      return messageHandler(res, 404, "User not found");
    }

    // const existingProfile = await Profile.findOne({ userID });
    // if (existingProfile) {
    //   return messageHandler(res, 400, "Profile already exists for this user");
    // }

    // const { firstName, lastName, DOB, gender, bio, heightFeet, isVerified } =
    //   req.body;
    const {
      firstName,
      lastName,
      DOB,
      gender,
      bio,
      heightFeet,
      isVerified,
      maritalStatusId, 
      religionId,
      communityId, 
      motherTongeId, 
      countryId, 
      cityId, 
      educationId, 
      professionId, 
    } = req.body;
    if (!firstName || !lastName || !DOB || !gender || !bio || !heightFeet) {
      return messageHandler(res, 400, "All fields are required");
    }

    const newProfile = await Profile.create({
      userID,
      firstName,
      lastName,
      DOB,
      gender,
      bio,
      heightFeet,
      isVerified: isVerified || false,
      maritalStatusId, 
      religionId, 
      communityId, 
      motherTongeId, 
      countryId, 
      cityId, 
      educationId, 
      professionId, 
    });

    // Add the new profile to user's profiles array
    user.profiles.push(newProfile._id);
    await user.save();

    
    return messageHandler(res, 200, "Profile created successfully", newProfile);
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Profile Create Server Error: ${error.message}`,
      error
    );
  }
};

const getAllProfile = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate("maritalStatusId", "name")
      .populate("religionId", "name")
      .populate("communityId", "name")
      .populate("motherTongeId", "name")
      .populate("countryId", "name")
      .populate("cityId", "name")
      .populate("educationId", "name")
      .populate("professionId", "name");

    if (profiles) {
      return messageHandler(
        res,
        200,
        `${profiles.length} Profile Found`,
        profiles
      );
    }
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Get User Profile Server Error ${error.message}`,
      error
    );
  }
};

const getProfileById = async (req, res) => {
  try {
    const { profileId } = req.params;
    const profile = await Profile.findById(profileId)
      .populate("maritalStatusId", "name")
      .populate("religionId", "name")
      .populate("communityId", "name")
      .populate("motherTongeId", "name")
      .populate("countryId", "name")
      .populate("cityId", "name")
      .populate("educationId", "name")
      .populate("professionId", "name");

    if (!profile) {
      return messageHandler(res, 404, "Profile Not Found");
    }

    return messageHandler(res, 200, "Profile found successfully", profile);
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Get Profile By ID Server Error: ${error.message}`,
      error
    );
  }
};
const editProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const userID = req.userId;
    const user = await User.findById(userID);
    if (!user) {
      return messageHandler(res, 404, "User Not Found Please Login");
    }
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return messageHandler(res, 404, "Profile Not Found");
    }
    
    if (profile.userID.toString() !== userID) {
      return messageHandler(
        res,
        403,
        "You are not authorized to edit this profile."
      );
    }

    const {
      firstName,
      lastName,
      DOB,
      gender,
      bio,
      heightFeet,
      isVerified,
      maritalStatusId,
      religionId,
      communityId,
      motherTongeId,
      countryId,
      cityId,
      educationId,
      professionId,
    } = req.body;

    // Update fields if provided
    if (firstName) profile.firstName = firstName;
    if (lastName) profile.lastName = lastName;
    if (DOB) profile.DOB = DOB;
    if (gender) profile.gender = gender;
    if (bio) profile.bio = bio;
    if (heightFeet) profile.heightFeet = heightFeet;
    if (isVerified !== undefined) profile.isVerified = isVerified;
    if (maritalStatusId) profile.maritalStatusId = maritalStatusId;
    if (religionId) profile.religionId = religionId;
    if (communityId) profile.communityId = communityId;
    if (motherTongeId) profile.motherTongeId = motherTongeId;
    if (countryId) profile.countryId = countryId;
    if (cityId) profile.cityId = cityId;
    if (educationId) profile.educationId = educationId;
    if (professionId) profile.professionId = professionId;

    const updateProfile = await profile.save();

    if (updateProfile) {
      return messageHandler(res, 200, "Profile Updated Successfully", updateProfile);
    }
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Edit Profile Server Error ${error.message}`,
      error
    );
  }
};
const deleteProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const userID = req.userId;
    const user = await User.findById(userID);
    if (!user) {
      return messageHandler(res, 404, "User Not Found Please Login");
    }
    const profile = await Profile.findById(profileId);
    console.log("User Profile", profile);
    if (!profile) {
      return messageHandler(res, 404, "Profile Not Found");
    }

    const findIndex = user.profiles.findIndex(
      (element) => element._id.toString() === profileId
    );

    const deleteFromProfileArr = user.profiles.splice(findIndex, 1);
    await user.save();
    await Profile.findByIdAndDelete(profileId);
    if (deleteFromProfileArr) {
      return messageHandler(res, 200, "User Delete Successfully");
    }
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Delete Profile Server Error ${error.message}`,
      error
    );
  }
};
const uploadProfilesImage = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return messageHandler(res, 404, "User Not Found");
    }
    const { profileId } = req.params;
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return messageHandler(res, 404, "Profile Not Found");
    }
    if (!req.file) {
      return messageHandler(res, 400, "No file uploaded");
    }
    const imagePath = req.file.path;
    const upload = await uploadToCloud(imagePath);
    console.log("Image Path:", imagePath);
    if (upload) {
      profile.profileImageUrl = upload.secure_url;
      await profile.save();
      return messageHandler(res, 200, "Upload Succesfully", upload);
    } else {
      return messageHandler(res, 400, "some Error, try After some time");
    }
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Upload Image Profile Server Error ${error.message}`,
      error
    );
  }
};
module.exports = {
  createProfile,
  getAllProfile,
  getProfileById,
  editProfile,
  deleteProfile,
  uploadProfilesImage,
};
