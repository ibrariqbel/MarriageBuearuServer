const express = require('express');
const { connectedDb } = require('./Config/conn');
const { registerHandler, loginHandler, forgotPassHandler, resetPass, getUserbyId, deleteUser, uploadUserProfile, getAllUser, logoutHandler } = require('./Controllers/userController');
const { Authentication } = require('./Auth/Authentication');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { multmid } = require('./Middleware/multer');
const { createProfile, getAllProfile, getProfileById, editProfile, deleteProfile, uploadProfilesImage } = require('./Controllers/profileController');
const { checkRole } = require('./Auth/adminMiddleware');
const { createLookup, getAllLookups, updateLookup, deleteLookup } = require('./Controllers/lookupController');
const { createOrUpdatePreference, getPreference } = require('./Controllers/partnerPreferenceController');
const { MaritalStatus } = require('./Models/MaritalStatusModel');
const { Countries } = require('./Models/CountryModel');
const { Religions } = require('./Models/religionModel');
const { Professions } = require('./Models/ProfessionModel');
const { Cities } = require('./Models/CityModel');
const { Communities } = require('./Models/CommunityModel');
const { MotherTongues } = require('./Models/MotherTongueModel');
const { EducationLevels } = require('./Models/EducationLevelModel');
const {
  validateRegistration,
  validateLogin,
  validateProfileCreation,
  validateLookupCreation,
  validatePartnerPreference,
  validateObjectId,
  validatePaymentUpload,
  validatePaymentReview,
} = require('./Middleware/validation');
const {
  uploadPaymentSlip,
  getAllPayments,
  getMyPayments,
  getPaymentById,
  approvePayment,
  rejectPayment,
  deletePayment,
} = require('./Controllers/paymentController');
const { Payment } = require('./Models/paymentModel');


const app = express();
require('dotenv').config()
const PORT = process.env.PORT;
 

// Middleware 
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// User Routes
app.get('/', (req, res) => { res.json({ message: "Marriage Bureau API - Server is running", version: "1.0.0" }) });
app.post('/user/register', validateRegistration, registerHandler);
app.post('/user/login', validateLogin, loginHandler);
app.post('/user/logout', Authentication, logoutHandler);
app.post('/user/forgot', forgotPassHandler);
app.post('/user/password/reset', Authentication, resetPass);
app.get('/user/getbyid/:userId', validateObjectId('userId'), getUserbyId);
app.get('/user/getAllUser', Authentication, checkRole(['super admin']), getAllUser);
app.delete('/user/delete', Authentication, deleteUser);
app.post('/user/upload/profile', multmid, Authentication, uploadUserProfile);

// Profile Routes
app.post('/profile/create', Authentication, validateProfileCreation, createProfile);
app.get('/profile/getAll/profiles', getAllProfile);
app.get('/profile/getAll/profile/:profileId', validateObjectId('profileId'), getProfileById);
app.put('/profile/update/:profileId', Authentication, validateObjectId('profileId'), editProfile);
app.delete('/profile/delete/:profileId', Authentication, validateObjectId('profileId'), deleteProfile);
app.post('/profile/upload/:profileId', multmid, Authentication, validateObjectId('profileId'), uploadProfilesImage);

// Partner Preference Routes
app.post('/preference/:profileId', Authentication, validateObjectId('profileId'), validatePartnerPreference, createOrUpdatePreference);
app.get('/preference/:profileId', validateObjectId('profileId'), getPreference);




// Lookup Routes - Marital Status
app.post("/maritalstatus/create", Authentication, checkRole(['super admin']), validateLookupCreation, createLookup(MaritalStatus));
app.get("/maritalstatus/getAll", getAllLookups(MaritalStatus));
app.put("/maritalstatus/update/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), updateLookup(MaritalStatus));
app.delete("/maritalstatus/delete/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), deleteLookup(MaritalStatus));

// Lookup Routes - Country
app.post("/country/create", Authentication, checkRole(['super admin']), validateLookupCreation, createLookup(Countries));
app.get("/country/getAll", getAllLookups(Countries));
app.put("/country/update/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), updateLookup(Countries));
app.delete("/country/delete/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), deleteLookup(Countries));

// Lookup Routes - Religions
app.post("/religions/create", Authentication, checkRole(['super admin']), validateLookupCreation, createLookup(Religions));
app.get("/religions/getAll", getAllLookups(Religions));
app.put("/religions/update/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), updateLookup(Religions));
app.delete("/religions/delete/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), deleteLookup(Religions));

// Lookup Routes - Professions
app.post("/professions/create", Authentication, checkRole(['super admin']), validateLookupCreation, createLookup(Professions));
app.get("/professions/getAll", getAllLookups(Professions));
app.put("/professions/update/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), updateLookup(Professions));
app.delete("/professions/delete/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), deleteLookup(Professions));

// Lookup Routes - Cities
app.post("/cities/create", Authentication, checkRole(['super admin']), validateLookupCreation, createLookup(Cities));
app.get("/cities/getAll", getAllLookups(Cities));
app.put("/cities/update/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), updateLookup(Cities));
app.delete("/cities/delete/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), deleteLookup(Cities));

// Lookup Routes - Communities
app.post("/communities/create", Authentication, checkRole(['super admin']), validateLookupCreation, createLookup(Communities));
app.get("/communities/getAll", getAllLookups(Communities));
app.put("/communities/update/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), updateLookup(Communities));
app.delete("/communities/delete/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), deleteLookup(Communities));

// Lookup Routes - MotherTongues
app.post("/motherTongues/create", Authentication, checkRole(['super admin']), validateLookupCreation, createLookup(MotherTongues));
app.get("/motherTongues/getAll", getAllLookups(MotherTongues));
app.put("/motherTongues/update/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), updateLookup(MotherTongues));
app.delete("/motherTongues/delete/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), deleteLookup(MotherTongues));

// Lookup Routes - EducationLevels
app.post("/edu/create", Authentication, checkRole(['super admin']), validateLookupCreation, createLookup(EducationLevels));
app.get("/edu/getAll", getAllLookups(EducationLevels));
app.put("/edu/update/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), updateLookup(EducationLevels));
app.delete("/edu/delete/:id", Authentication, checkRole(['super admin']), validateObjectId('id'), deleteLookup(EducationLevels));

// Payment Routes
app.post('/payment/upload', multmid, Authentication, validatePaymentUpload, uploadPaymentSlip);
app.get('/payment/my-payments', Authentication, getMyPayments);
app.get('/payment/all', Authentication, checkRole(['admin', 'super admin']), getAllPayments);
app.get('/payment/:paymentId', Authentication, validateObjectId('paymentId'), getPaymentById);
app.put('/payment/approve/:paymentId', Authentication, checkRole(['admin', 'super admin']), validateObjectId('paymentId'), validatePaymentReview, approvePayment);
app.put('/payment/reject/:paymentId', Authentication, checkRole(['admin', 'super admin']), validateObjectId('paymentId'), validatePaymentReview, rejectPayment);
app.delete('/payment/delete/:paymentId', Authentication, checkRole(['admin', 'super admin']), validateObjectId('paymentId'), deletePayment);






















connectedDb();
app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});
