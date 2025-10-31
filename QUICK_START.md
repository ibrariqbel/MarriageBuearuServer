# 🚀 Quick Start Guide - Marriage Bureau Backend

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Gmail account with App Password

---

## 📦 Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual values
nano .env  # or use any text editor
```

### 3. Required Environment Variables

```env
# Server
PORT=3000

# Database (choose one)
# Local MongoDB:
MONGOOSE_URL=mongodb://localhost:27017/marriage_bureau

# OR MongoDB Atlas:
# MONGOOSE_URL=mongodb+srv://username:password@cluster.mongodb.net/marriage_bureau

# JWT Secret (generate a random string)
SECERITKEY=your_random_secret_key_here

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail (use App Password, not regular password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

---

## 🔑 Getting API Keys

### MongoDB Atlas (Free Tier)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Replace `<password>` with your password

### Cloudinary (Free Tier)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to Dashboard
4. Copy: Cloud Name, API Key, API Secret

### Gmail App Password
1. Enable 2-Factor Authentication on your Google Account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Other (Custom name)"
4. Generate password (16 characters)
5. Use this password in `.env` file

### JWT Secret
Generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🏃 Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will start on: `http://localhost:3000`

---

## ✅ Verify Installation

### 1. Check Server is Running
```bash
curl http://localhost:3000
```

Expected response:
```json
{
  "message": "Marriage Bureau API - Server is running",
  "version": "1.0.0"
}
```

### 2. Test User Registration
```bash
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "phoneNumber": "1234567890",
    "role": "customer"
  }'
```

### 3. Test Login
```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 📋 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Check MongoDB is running (if local)
- Verify connection string in `.env`
- Check network access in MongoDB Atlas

### Issue: "Cloudinary upload failed"
**Solution**:
- Verify Cloudinary credentials in `.env`
- Check API key is correct
- Ensure cloud name matches

### Issue: "Email not sending"
**Solution**:
- Use App Password, not regular Gmail password
- Enable 2-Factor Authentication first
- Check EMAIL_USER and EMAIL_PASS in `.env`

### Issue: "Token validation failed"
**Solution**:
- Check SECERITKEY is set in `.env`
- Ensure cookie-parser middleware is active
- Verify token is being sent in cookies

### Issue: "Validation errors"
**Solution**:
- Check request body matches required format
- Ensure all required fields are provided
- Verify data types are correct

---

## 🧪 Testing the API

### Using Postman
1. Import the API endpoints from `API_DOCUMENTATION.md`
2. Set base URL: `http://localhost:3000`
3. For authenticated routes, login first to get cookie
4. Cookie will be automatically included in subsequent requests

### Using cURL
See examples in `API_DOCUMENTATION.md`

### Using Thunder Client (VS Code)
1. Install Thunder Client extension
2. Create new request
3. Set method and URL
4. Add request body (JSON)
5. Send request

---

## 👤 Creating First Super Admin

### Method 1: Direct Database Insert
```javascript
// Connect to MongoDB and run:
db.users.insertOne({
  username: "superadmin",
  email: "admin@example.com",
  phoneNumber: "9999999999",
  password: "$2b$10$...", // Use bcrypt to hash password
  role: "super admin",
  accountStatus: "Active",
  profiles: [],
  createdAt: new Date(),
  lastLoginAt: new Date()
})
```

### Method 2: Register and Update
```bash
# 1. Register normal user
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123",
    "phoneNumber": "9999999999"
  }'

# 2. Update role in database
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "super admin" } }
)
```

---

## 📊 Project Structure

```
MarriageBuearu/
├── Auth/                    # Authentication middleware
│   ├── Authentication.js    # JWT verification
│   └── adminMiddleware.js   # Role-based access
├── Config/                  # Configuration
│   └── conn.js             # Database connection
├── Controllers/             # Business logic
│   ├── userController.js
│   ├── profileController.js
│   ├── partnerPreferenceController.js
│   └── lookupController.js
├── Middleware/              # Custom middleware
│   ├── multer.js           # File upload
│   └── validation.js       # Input validation
├── Models/                  # Database schemas
│   ├── userModel.js
│   ├── profileModel.js
│   ├── partnerPreferenceModel.js
│   └── [lookup models]
├── utils/                   # Utility functions
│   ├── cloudinary.js       # Image upload
│   ├── nodemailer.js       # Email service
│   └── messageHandler.js   # Response handler
├── uploads/                 # Temporary file storage
├── .env                     # Environment variables (create this)
├── .env.example            # Environment template
├── index.js                # Main server file
├── package.json            # Dependencies
├── API_DOCUMENTATION.md    # API docs
├── FIXES_APPLIED.md        # Change history
├── DEBUGGING_SUMMARY.md    # Bug fixes summary
└── QUICK_START.md          # This file
```

---

## 🔐 Security Checklist

Before going to production:

- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Never commit `.env` file
- [ ] Review and test all endpoints
- [ ] Enable logging
- [ ] Set up monitoring

---

## 📚 Next Steps

1. **Read Documentation**
   - `API_DOCUMENTATION.md` - Complete API reference
   - `FIXES_APPLIED.md` - All changes made
   - `DEBUGGING_SUMMARY.md` - Bug fixes overview

2. **Test All Features**
   - User registration/login
   - Profile management
   - Partner preferences
   - Lookup data CRUD
   - Image uploads
   - Email functionality

3. **Customize**
   - Add business-specific features
   - Customize validation rules
   - Add additional endpoints
   - Implement matching algorithm

4. **Deploy**
   - Choose hosting platform (Heroku, AWS, DigitalOcean)
   - Set up production database
   - Configure environment variables
   - Enable monitoring and logging

---

## 🆘 Getting Help

### Documentation
- API Documentation: `API_DOCUMENTATION.md`
- Bug Fixes: `FIXES_APPLIED.md`
- Debugging Info: `DEBUGGING_SUMMARY.md`

### Common Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Check for errors
npm run dev 2>&1 | grep -i error

# View logs
tail -f logs/app.log  # if logging is set up
```

### Debugging Tips
1. Check server logs for errors
2. Verify environment variables are set
3. Test database connection
4. Check API endpoints with Postman
5. Review validation errors in response
6. Ensure all services (MongoDB, Cloudinary) are accessible

---

## ✨ Features Overview

### User Management
- ✅ Registration with validation
- ✅ Login (email or phone)
- ✅ Logout
- ✅ Password reset via email
- ✅ Profile picture upload
- ✅ Role-based access (super admin, admin, customer)

### Profile Management
- ✅ Create detailed profiles
- ✅ Update all profile fields
- ✅ Upload profile images
- ✅ View all profiles
- ✅ Search by ID
- ✅ Delete profiles

### Partner Preferences
- ✅ Set age range
- ✅ Set height range
- ✅ Select marital status preferences
- ✅ Select religion preferences
- ✅ Select community preferences
- ✅ Select education preferences
- ✅ Select profession preferences

### Lookup Data Management (Super Admin)
- ✅ Marital Status
- ✅ Religions
- ✅ Communities
- ✅ Mother Tongues
- ✅ Countries
- ✅ Cities
- ✅ Education Levels
- ✅ Professions

---

## 🎉 You're Ready!

Your Marriage Bureau backend is now set up and ready to use!

**Server URL**: `http://localhost:3000`

**Test it**: Open browser and visit `http://localhost:3000`

**Happy Coding! 🚀**
