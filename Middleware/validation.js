const { messageHandler } = require("../utils/messageHandler");

// Validate registration input
const validateRegistration = (req, res, next) => {
  const { username, email, password, phoneNumber } = req.body;
  
  if (!username || username.trim() === "") {
    return messageHandler(res, 400, "Username is required");
  }
  
  if (!email || email.trim() === "") {
    return messageHandler(res, 400, "Email is required");
  }
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return messageHandler(res, 400, "Invalid email format");
  }
  
  if (!password || password.length < 6) {
    return messageHandler(res, 400, "Password must be at least 6 characters");
  }
  
  if (!phoneNumber || phoneNumber.trim() === "") {
    return messageHandler(res, 400, "Phone number is required");
  }
  
  // Phone number validation (basic)
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
    return messageHandler(res, 400, "Invalid phone number format");
  }
  
  next();
};

// Validate login input
const validateLogin = (req, res, next) => {
  const { email, phoneNumber, password } = req.body;
  
  if ((!email && !phoneNumber) || !password) {
    return messageHandler(res, 400, "Email/Phone and password are required");
  }
  
  if (!password || password.trim() === "") {
    return messageHandler(res, 400, "Password is required");
  }
  
  next();
};

// Validate profile creation
const validateProfileCreation = (req, res, next) => {
  const { firstName, lastName, DOB, gender, bio, heightFeet } = req.body;
  
  if (!firstName || firstName.trim() === "") {
    return messageHandler(res, 400, "First name is required");
  }
  
  if (!lastName || lastName.trim() === "") {
    return messageHandler(res, 400, "Last name is required");
  }
  
  if (!DOB) {
    return messageHandler(res, 400, "Date of birth is required");
  }
  
  // Validate age (must be 18+)
  const birthDate = new Date(DOB);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 18) {
    return messageHandler(res, 400, "Must be at least 18 years old");
  }
  
  if (!gender || !["Male", "Female", "Other"].includes(gender)) {
    return messageHandler(res, 400, "Valid gender is required (Male/Female/Other)");
  }
  
  if (!bio || bio.trim() === "") {
    return messageHandler(res, 400, "Bio is required");
  }
  
  if (bio.length > 1000) {
    return messageHandler(res, 400, "Bio must not exceed 1000 characters");
  }
  
  if (!heightFeet || heightFeet.trim() === "") {
    return messageHandler(res, 400, "Height is required");
  }
  
  next();
};

// Validate lookup creation
const validateLookupCreation = (req, res, next) => {
  const { name } = req.body;
  
  if (!name || name.trim() === "") {
    return messageHandler(res, 400, "Name is required");
  }
  
  if (name.length < 2) {
    return messageHandler(res, 400, "Name must be at least 2 characters");
  }
  
  next();
};

// Validate partner preference
const validatePartnerPreference = (req, res, next) => {
  const { ageRange, heightRange } = req.body;
  
  if (ageRange) {
    if (ageRange.min && ageRange.max && ageRange.min > ageRange.max) {
      return messageHandler(res, 400, "Invalid age range: min cannot be greater than max");
    }
    if (ageRange.min && ageRange.min < 18) {
      return messageHandler(res, 400, "Minimum age must be at least 18");
    }
  }
  
  if (heightRange) {
    if (heightRange.min && heightRange.max && heightRange.min > heightRange.max) {
      return messageHandler(res, 400, "Invalid height range: min cannot be greater than max");
    }
  }
  
  next();
};

// Validate MongoDB ObjectId
const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    
    if (!objectIdRegex.test(id)) {
      return messageHandler(res, 400, `Invalid ${paramName} format`);
    }
    
    next();
  };
};

// Validate payment slip upload
const validatePaymentUpload = (req, res, next) => {
  const { membershipPlanId, amount } = req.body;
  
  if (!membershipPlanId || membershipPlanId.trim() === "") {
    return messageHandler(res, 400, "Membership plan ID is required");
  }
  
  // Validate ObjectId format
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(membershipPlanId)) {
    return messageHandler(res, 400, "Invalid membership plan ID format");
  }
  
  if (amount && (isNaN(amount) || amount <= 0)) {
    return messageHandler(res, 400, "Amount must be a positive number");
  }
  
  next();
};

// Validate payment review (approve/reject)
const validatePaymentReview = (req, res, next) => {
  const { remarks } = req.body;
  
  if (remarks && remarks.length > 500) {
    return messageHandler(res, 400, "Remarks must not exceed 500 characters");
  }
  
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileCreation,
  validateLookupCreation,
  validatePartnerPreference,
  validateObjectId,
  validatePaymentUpload,
  validatePaymentReview,
};
