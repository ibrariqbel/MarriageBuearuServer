# Marriage Bureau API Documentation

## Overview
This is a comprehensive Marriage Bureau Management System API built with Node.js, Express, and MongoDB.

## Features
- User Authentication & Authorization
- Profile Management
- Partner Preference Management
- Lookup Data Management (Religions, Communities, Countries, etc.)
- Role-based Access Control (Super Admin, Admin, Customer)
- Image Upload Support
- Email Notifications

---

## Base URL
```
http://localhost:3000
```

---

## Authentication
Most endpoints require authentication via JWT token stored in cookies.

---

## API Endpoints

### 1. User Routes

#### Register User
```http
POST /user/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "1234567890",
  "role": "customer"
}
```

#### Login User
```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```
OR
```http
{
  "phoneNumber": "1234567890",
  "password": "password123"
}
```

#### Logout User
```http
POST /user/logout
Authorization: Required (Cookie)
```

#### Forgot Password
```http
POST /user/forgot
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /user/password/reset
Authorization: Required (Cookie)
Content-Type: application/json

{
  "newPass": "newpassword123",
  "confirmPass": "newpassword123"
}
```

#### Get All Users (Super Admin Only)
```http
GET /user/getAllUser
Authorization: Required (Cookie)
```

#### Delete User
```http
DELETE /user/delete
Authorization: Required (Cookie)
Content-Type: application/json

{
  "password": "password123"
}
```

#### Upload User Profile Picture
```http
POST /user/upload/profile
Authorization: Required (Cookie)
Content-Type: multipart/form-data

Form Data:
- file: [image file]
```

---

### 2. Profile Routes

#### Create Profile
```http
POST /profile/create
Authorization: Required (Cookie)
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "DOB": "1990-01-01",
  "gender": "Male",
  "bio": "Looking for a life partner",
  "heightFeet": "5'10\"",
  "maritalStatusId": "objectId",
  "religionId": "objectId",
  "communityId": "objectId",
  "motherTongeId": "objectId",
  "countryId": "objectId",
  "cityId": "objectId",
  "educationId": "objectId",
  "professionId": "objectId"
}
```

#### Get All Profiles
```http
GET /profile/getAll/profiles
```

#### Get Profile by ID
```http
GET /profile/getAll/profile/:profileId
```

#### Update Profile
```http
PUT /profile/update/:profileId
Authorization: Required (Cookie)
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "DOB": "1990-01-01",
  "gender": "Male",
  "bio": "Updated bio",
  "heightFeet": "5'10\"",
  "isVerified": false
}
```

#### Delete Profile
```http
DELETE /profile/delete/:profileId
Authorization: Required (Cookie)
```

#### Upload Profile Image
```http
POST /profile/upload/:profileId
Authorization: Required (Cookie)
Content-Type: multipart/form-data

Form Data:
- file: [image file]
```

---

### 3. Partner Preference Routes

#### Create/Update Partner Preference
```http
POST /preference/:profileId
Authorization: Required (Cookie)
Content-Type: application/json

{
  "ageRange": {
    "min": 25,
    "max": 35
  },
  "heightRange": {
    "min": 160,
    "max": 180
  },
  "maritalStatusIds": ["objectId1", "objectId2"],
  "religionIds": ["objectId1"],
  "motherTongueIds": ["objectId1", "objectId2"],
  "communityIds": ["objectId1"],
  "countryIds": ["objectId1", "objectId2"],
  "educationIds": ["objectId1"],
  "professionIds": ["objectId1", "objectId2"]
}
```

#### Get Partner Preference
```http
GET /preference/:profileId
```

---

### 4. Lookup Routes (Super Admin Only)

All lookup routes follow the same pattern for CRUD operations:

#### Marital Status
```http
POST   /maritalstatus/create
GET    /maritalstatus/getAll
PUT    /maritalstatus/update/:id
DELETE /maritalstatus/delete/:id
```

#### Countries
```http
POST   /country/create
GET    /country/getAll
PUT    /country/update/:id
DELETE /country/delete/:id
```

#### Religions
```http
POST   /religions/create
GET    /religions/getAll
PUT    /religions/update/:id
DELETE /religions/delete/:id
```

#### Professions
```http
POST   /professions/create
GET    /professions/getAll
PUT    /professions/update/:id
DELETE /professions/delete/:id
```

#### Cities
```http
POST   /cities/create
GET    /cities/getAll
PUT    /cities/update/:id
DELETE /cities/delete/:id
```

#### Communities
```http
POST   /communities/create
GET    /communities/getAll
PUT    /communities/update/:id
DELETE /communities/delete/:id
```

#### Mother Tongues
```http
POST   /motherTongues/create
GET    /motherTongues/getAll
PUT    /motherTongues/update/:id
DELETE /motherTongues/delete/:id
```

#### Education Levels
```http
POST   /edu/create
GET    /edu/getAll
PUT    /edu/update/:id
DELETE /edu/delete/:id
```

#### Lookup Create/Update Request Body
```json
{
  "name": "Hindu",
  "description": "Hindu religion"
}
```

---

## User Roles

1. **Super Admin**: Full access to all features including lookup data management
2. **Admin**: Can manage business registrations
3. **Customer**: Can create profiles and set preferences

---

## Response Format

### Success Response
```json
{
  "status": 200,
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "status": 400,
  "message": "Error message"
}
```

---

## Environment Variables

Create a `.env` file with the following variables (see `.env.example` for template):

```env
# Server Configuration
PORT=3000

# Database Configuration
MONGOOSE_URL=mongodb://localhost:27017/marriage_bureau

# JWT Secret Key
SECERITKEY=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

**Important Notes:**
- For Gmail, enable 2-factor authentication and generate an "App Password"
- Never commit your `.env` file to version control
- Use `.env.example` as a template

---

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with required environment variables

4. Start the server:
```bash
npm start
```

---

## Dependencies

- express
- mongoose
- bcrypt
- jsonwebtoken
- nodemailer
- cloudinary
- multer
- cookie-parser
- cors
- dotenv

---

## Models

1. **User**: User authentication and account management
2. **Profile**: User profile information
3. **PartnerPreference**: Partner preference criteria
4. **MaritalStatus**: Lookup for marital status
5. **Religion**: Lookup for religions
6. **Community**: Lookup for communities
7. **MotherTongue**: Lookup for mother tongues
8. **Country**: Lookup for countries
9. **City**: Lookup for cities
10. **EducationLevel**: Lookup for education levels
11. **Profession**: Lookup for professions
12. **Business**: Business registration (for admins)
13. **MembershipPlan**: Membership plans

---

## Notes

- All authenticated routes require a valid JWT token in cookies
- Image uploads are handled via Cloudinary
- Password reset links are sent via email
- Super admin role is required for managing lookup data
- Profile ownership is verified before updates/deletes
- Input validation is applied to all routes
- MongoDB ObjectId format is validated for all ID parameters
- Age validation: Users must be 18+ years old
- Email and phone number formats are validated
- Password must be at least 6 characters

## Validation Rules

### Registration
- Username: Required, non-empty
- Email: Required, valid email format
- Password: Required, minimum 6 characters
- Phone Number: Required, 10-15 digits

### Profile Creation
- First Name: Required
- Last Name: Required
- Date of Birth: Required, must be 18+ years old
- Gender: Required (Male/Female/Other)
- Bio: Required, max 1000 characters
- Height: Required

### Partner Preferences
- Age Range: Min cannot be greater than max, minimum age 18
- Height Range: Min cannot be greater than max

### Lookup Data
- Name: Required, minimum 2 characters
- Description: Optional

---

## Payment Management

### Upload Payment Slip
```http
POST /payment/upload
Authorization: Required (Cookie)
Content-Type: multipart/form-data

Form Data:
- image: [payment slip image file]
- membershipPlanId: "objectId"
- amount: 1000 (optional, defaults to plan price)
- transactionId: "TXN123456" (optional)
- paymentMethod: "Bank Transfer" (optional)
```

### Get My Payments
```http
GET /payment/my-payments
Authorization: Required (Cookie)
```

### Get All Payments (Admin/Super Admin)
```http
GET /payment/all
Authorization: Required (Cookie)
Query Parameters:
- status: pending | approved | rejected (optional)
```

### Get Payment by ID
```http
GET /payment/:paymentId
Authorization: Required (Cookie)
```

### Approve Payment (Admin/Super Admin)
```http
PUT /payment/approve/:paymentId
Authorization: Required (Cookie)
Content-Type: application/json

{
  "remarks": "Payment verified and approved" (optional)
}
```

### Reject Payment (Admin/Super Admin)
```http
PUT /payment/reject/:paymentId
Authorization: Required (Cookie)
Content-Type: application/json

{
  "remarks": "Invalid payment slip" (required for rejection)
}
```

### Delete Payment (Admin/Super Admin)
```http
DELETE /payment/delete/:paymentId
Authorization: Required (Cookie)
```

---

## Payment Workflow

1. **User uploads payment slip**
   - User selects membership plan
   - Uploads payment slip image
   - Provides transaction details
   - Status: `pending`

2. **Admin reviews payment**
   - Admin views all pending payments
   - Reviews payment slip image
   - Either approves or rejects

3. **Approval**
   - Payment status: `approved`
   - User's membership plan updated
   - User account status: `Active`

4. **Rejection**
   - Payment status: `rejected`
   - Admin provides rejection reason
   - User can upload new payment slip
