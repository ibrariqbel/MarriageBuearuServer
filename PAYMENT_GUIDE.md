# 💳 Payment System Guide

## Overview

The Marriage Bureau backend now includes a complete payment management system where users can upload payment slip images and admins can approve or reject them.

---

## 🔄 Payment Workflow

### For Users (Customers)

1. **Upload Payment Slip**
   - User makes payment via bank transfer
   - Takes screenshot/photo of payment receipt
   - Uploads payment slip with membership plan details
   - Payment status: `pending`

2. **Track Payment Status**
   - View all submitted payments
   - Check approval/rejection status
   - Read admin remarks if rejected

3. **After Approval**
   - Membership plan automatically activated
   - Account status changed to `Active`
   - Can access premium features

### For Admins

1. **View Pending Payments**
   - See all payments awaiting review
   - Filter by status (pending/approved/rejected)
   - View payment slip images

2. **Review Payment**
   - Verify payment slip authenticity
   - Check transaction details
   - Approve or reject with remarks

3. **Approve Payment**
   - User's membership activated
   - Account status updated
   - Payment marked as approved

4. **Reject Payment**
   - Provide rejection reason
   - User can resubmit correct payment

---

## 📡 API Endpoints

### 1. Upload Payment Slip (User)

**Endpoint**: `POST /payment/upload`  
**Authentication**: Required  
**Content-Type**: `multipart/form-data`

**Request**:
```bash
curl -X POST http://localhost:3000/payment/upload \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -F "image=@/path/to/payment-slip.jpg" \
  -F "membershipPlanId=507f1f77bcf86cd799439011" \
  -F "amount=1000" \
  -F "transactionId=TXN123456" \
  -F "paymentMethod=Bank Transfer"
```

**Form Fields**:
- `image` (required): Payment slip image file
- `membershipPlanId` (required): ID of membership plan
- `amount` (optional): Payment amount (defaults to plan price)
- `transactionId` (optional): Bank transaction ID
- `paymentMethod` (optional): Payment method (default: "Bank Transfer")

**Response**:
```json
{
  "status": 201,
  "message": "Payment slip uploaded successfully. Awaiting admin approval.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "membershipPlanId": "507f1f77bcf86cd799439013",
    "amount": 1000,
    "paymentSlipUrl": "https://cloudinary.com/...",
    "status": "pending",
    "transactionId": "TXN123456",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Get My Payments (User)

**Endpoint**: `GET /payment/my-payments`  
**Authentication**: Required

**Request**:
```bash
curl -X GET http://localhost:3000/payment/my-payments \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response**:
```json
{
  "status": 200,
  "message": "3 payment(s) found",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "membershipPlanId": {
        "name": "Premium",
        "price": 1000,
        "duration": 30
      },
      "amount": 1000,
      "paymentSlipUrl": "https://cloudinary.com/...",
      "status": "approved",
      "reviewedBy": {
        "username": "admin",
        "email": "admin@example.com"
      },
      "remarks": "Payment verified",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 3. Get All Payments (Admin)

**Endpoint**: `GET /payment/all`  
**Authentication**: Required (Admin/Super Admin)  
**Query Parameters**: `status` (optional)

**Request**:
```bash
# Get all payments
curl -X GET http://localhost:3000/payment/all \
  -H "Cookie: token=ADMIN_JWT_TOKEN"

# Get only pending payments
curl -X GET "http://localhost:3000/payment/all?status=pending" \
  -H "Cookie: token=ADMIN_JWT_TOKEN"
```

**Response**:
```json
{
  "status": 200,
  "message": "5 payment(s) found",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": {
        "username": "john_doe",
        "email": "john@example.com",
        "phoneNumber": "1234567890"
      },
      "membershipPlanId": {
        "name": "Premium",
        "price": 1000,
        "duration": 30
      },
      "amount": 1000,
      "paymentSlipUrl": "https://cloudinary.com/...",
      "status": "pending",
      "transactionId": "TXN123456",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 4. Get Payment by ID

**Endpoint**: `GET /payment/:paymentId`  
**Authentication**: Required (Owner or Admin)

**Request**:
```bash
curl -X GET http://localhost:3000/payment/507f1f77bcf86cd799439011 \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response**:
```json
{
  "status": 200,
  "message": "Payment found",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": {
      "username": "john_doe",
      "email": "john@example.com"
    },
    "membershipPlanId": {
      "name": "Premium",
      "price": 1000
    },
    "amount": 1000,
    "paymentSlipUrl": "https://cloudinary.com/...",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. Approve Payment (Admin)

**Endpoint**: `PUT /payment/approve/:paymentId`  
**Authentication**: Required (Admin/Super Admin)  
**Content-Type**: `application/json`

**Request**:
```bash
curl -X PUT http://localhost:3000/payment/approve/507f1f77bcf86cd799439011 \
  -H "Cookie: token=ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "remarks": "Payment verified and approved"
  }'
```

**Response**:
```json
{
  "status": 200,
  "message": "Payment approved successfully. User membership updated.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "approved",
    "reviewedBy": "507f1f77bcf86cd799439014",
    "reviewedAt": "2024-01-01T12:00:00.000Z",
    "remarks": "Payment verified and approved"
  }
}
```

**Side Effects**:
- User's `membershipPlanId` updated
- User's `accountStatus` changed to "Active"

---

### 6. Reject Payment (Admin)

**Endpoint**: `PUT /payment/reject/:paymentId`  
**Authentication**: Required (Admin/Super Admin)  
**Content-Type**: `application/json`

**Request**:
```bash
curl -X PUT http://localhost:3000/payment/reject/507f1f77bcf86cd799439011 \
  -H "Cookie: token=ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "remarks": "Payment slip is unclear. Please upload a clearer image."
  }'
```

**Response**:
```json
{
  "status": 200,
  "message": "Payment rejected",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "rejected",
    "reviewedBy": "507f1f77bcf86cd799439014",
    "reviewedAt": "2024-01-01T12:00:00.000Z",
    "remarks": "Payment slip is unclear. Please upload a clearer image."
  }
}
```

---

### 7. Delete Payment (Admin)

**Endpoint**: `DELETE /payment/delete/:paymentId`  
**Authentication**: Required (Admin/Super Admin)

**Request**:
```bash
curl -X DELETE http://localhost:3000/payment/delete/507f1f77bcf86cd799439011 \
  -H "Cookie: token=ADMIN_JWT_TOKEN"
```

**Response**:
```json
{
  "status": 200,
  "message": "Payment deleted successfully"
}
```

---

## 🔐 Authorization Rules

### Users (Customers)
- ✅ Can upload payment slips
- ✅ Can view their own payments
- ✅ Can view details of their own payments
- ❌ Cannot view other users' payments
- ❌ Cannot approve/reject payments
- ❌ Cannot delete payments

### Admins
- ✅ Can view all payments
- ✅ Can filter payments by status
- ✅ Can view any payment details
- ✅ Can approve pending payments
- ✅ Can reject pending payments
- ✅ Can delete payments
- ❌ Cannot approve/reject already processed payments

---

## 📋 Payment Status Flow

```
pending → approved (by admin) → User membership activated
   ↓
rejected (by admin) → User can resubmit
```

**Status Values**:
- `pending`: Awaiting admin review
- `approved`: Payment verified and accepted
- `rejected`: Payment not accepted (with reason)

---

## 🧪 Testing the Payment System

### 1. Create a Membership Plan (Super Admin)

First, ensure you have membership plans created. If not, create one:

```bash
# This requires the membershipPlan model and routes to be implemented
# For now, you can manually insert into MongoDB:
db.membershipplans.insertOne({
  name: "Premium",
  price: 1000,
  duration: 30,
  features: ["Unlimited profiles", "Chat access", "Priority support"],
  createdAt: new Date()
})
```

### 2. User Uploads Payment Slip

```bash
# Login as user first
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Upload payment slip
curl -X POST http://localhost:3000/payment/upload \
  -H "Cookie: token=USER_TOKEN" \
  -F "image=@payment-slip.jpg" \
  -F "membershipPlanId=PLAN_ID" \
  -F "amount=1000"
```

### 3. Admin Reviews Payment

```bash
# Login as admin
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'

# View pending payments
curl -X GET "http://localhost:3000/payment/all?status=pending" \
  -H "Cookie: token=ADMIN_TOKEN"

# Approve payment
curl -X PUT http://localhost:3000/payment/approve/PAYMENT_ID \
  -H "Cookie: token=ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"remarks": "Approved"}'
```

---

## ⚠️ Important Notes

1. **Image Upload**: Payment slips are uploaded to Cloudinary
2. **File Size**: Ensure payment slip images are reasonable size (< 5MB recommended)
3. **Supported Formats**: JPG, PNG, PDF
4. **Status Changes**: Once approved/rejected, payment cannot be changed again
5. **Membership Activation**: Automatic on approval
6. **Security**: Only admins can approve/reject payments

---

## 🐛 Troubleshooting

### Payment Upload Fails
- Check Cloudinary credentials in `.env`
- Verify image file is valid
- Ensure membership plan ID exists

### Cannot Approve Payment
- Verify you have admin role
- Check payment is in `pending` status
- Ensure payment ID is valid

### Membership Not Activated
- Check if payment was approved successfully
- Verify user's membershipPlanId was updated
- Check user's accountStatus

---

## 📊 Database Schema

### Payment Model
```javascript
{
  userId: ObjectId (ref: User),
  membershipPlanId: ObjectId (ref: MembershipPlan),
  amount: Number,
  paymentSlipUrl: String,
  status: "pending" | "approved" | "rejected",
  paymentMethod: String,
  transactionId: String,
  remarks: String,
  reviewedBy: ObjectId (ref: User),
  reviewedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Best Practices

1. **For Users**:
   - Upload clear, readable payment slips
   - Include transaction ID if available
   - Check payment status regularly

2. **For Admins**:
   - Review payments promptly
   - Provide clear rejection reasons
   - Verify transaction details before approval

3. **For Developers**:
   - Add email notifications for status changes
   - Implement payment expiry (auto-reject after X days)
   - Add payment analytics dashboard
   - Consider adding refund functionality

---

**Payment system is now fully functional! 🎉**
