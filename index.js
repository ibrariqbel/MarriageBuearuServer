const express = require ('express');
const { connectedDb } = require('./Config/conn');
const { registerHandler, loginHandler, forgotPassHandler, resetPass, getUserbyId, deleteUser, uploadUserProfile, getAllUser } = require('./Controllers/userController');

//const cookieParser = require('cookie-parser');

const { Authentication } = require('./Auth/Authentication');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const { multmid } = require('./Middleware/multer');
const { createProfile, getAllProfile, getProfileById, editProfile, deleteProfile, uploadProfilesImage } = require('./Controllers/profileController');
const { checkRole } = require('./Auth/adminMiddleware');
const { createLookup } = require('./Controllers/lookupController');
const { MaritalStatus } = require('./Models/MaritalStatusModel');
const { Countries } = require('./Models/CountryModel');
const { Religions } = require('./Models/religionModel');
const { Professions } = require('./Models/ProfessionModel');
const { Cities } = require('./Models/CityModel');
const { Communities } = require('./Models/CommunityModel');
const { EducationLevels } = require('./Models/EducationLevelModel');


const app = express();
require('dotenv').config()
const PORT = process.env.PORT;
 

// Meddleware 
app.use(express.json())
app.use(cookieParser())
app.use(cors())

// User Path
app.get('/',(req , res)=>{res.json({message:"Test api"})});
app.post('/user/register',registerHandler);
app.post('/user/login',loginHandler);
app.post('/user/forgot',forgotPassHandler);
app.post('/user/password/reset',Authentication,resetPass);
app.get('/user/getbyid/:userId',getUserbyId);
app.get('/user/getAllUser',Authentication,getAllUser);
app.delete('/user/delete',Authentication,deleteUser);
app.post('/user/upload/profile',multmid,Authentication,uploadUserProfile);


// Profile 
app.post('/profile/create',Authentication,createProfile);
app.get('/profile/getAll/profiles',getAllProfile);
app.get('/profile/getAll/profile/:profileId',getProfileById);
app.put('/profile/update/:profileId',Authentication,editProfile)
app.delete('/profile/delete/:profileId',Authentication,deleteProfile)
app.get('/profile/upload/:profileId',multmid,Authentication,uploadProfilesImage)




// Generic Path

const adminRoles = ['admin', 'super admin'];

// Routes for Marital Status
app.post("/maritalstatus/create",Authentication,checkRole(['super admin']),createLookup(MaritalStatus))


// Routes for Country 
app.post("/country/create",Authentication,checkRole(['super admin']),createLookup(Countries))
// Religions
app.post("/religions/create",Authentication,checkRole(['super admin']),createLookup(Religions))
// Professions
app.post("/professions/create",Authentication,checkRole(['super admin']),createLookup(Professions))
//  Cities,
app.post("/cities/create",Authentication,checkRole(['super admin']),createLookup(Cities))

//  Communities,
app.post("/communities/create",Authentication,checkRole(['super admin']),createLookup(Communities))

//  MotherTongues, 
app.post("/motherTongues/create",Authentication,checkRole(['super admin']),createLookup(Communities))

// EducationLevels
app.post("/edu/create",Authentication,checkRole(['super admin']),createLookup(EducationLevels))






















connectedDb()
app.listen(PORT,()=>{
    console.log(`Server Listen on PORT ${PORT}`)
})