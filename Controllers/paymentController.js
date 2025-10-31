const { Payment } = require("../Models/paymentModel");
const { User } = require("../Models/userModel");
const { MembershipPlan } = require("../Models/membershipPlan");
const { messageHandler } = require("../utils/messageHandler");
const { uploadToCloud } = require("../utils/cloudinary");

// User uploads payment slip
const uploadPaymentSlip = async (req, res) => {
  try {
    const userId = req.userId;
    const { membershipPlanId, amount, transactionId, paymentMethod } = req.body;

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return messageHandler(res, 404, "User not found");
    }

    // Validate membership plan
    const plan = await MembershipPlan.findById(membershipPlanId);
    if (!plan) {
      return messageHandler(res, 404, "Membership plan not found");
    }

    // Check if file is uploaded
    if (!req.file) {
      return messageHandler(res, 400, "Payment slip image is required");
    }

    // Upload to Cloudinary
    const imagePath = req.file.path;
    const upload = await uploadToCloud(imagePath);

    if (!upload) {
      return messageHandler(res, 500, "Failed to upload payment slip");
    }

    // Create payment record
    const payment = await Payment.create({
      userId,
      membershipPlanId,
      amount: amount || plan.price,
      paymentSlipUrl: upload.secure_url,
      transactionId,
      paymentMethod: paymentMethod || "Bank Transfer",
      status: "pending",
    });

    return messageHandler(
      res,
      201,
      "Payment slip uploaded successfully. Awaiting admin approval.",
      payment
    );
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Upload Payment Slip Error: ${error.message}`,
      error
    );
  }
};

// Get all payments (Admin/Super Admin)
const getAllPayments = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user || !["admin", "super admin"].includes(user.role)) {
      return messageHandler(res, 403, "Access denied. Admin only.");
    }

    const { status } = req.query;
    const filter = status ? { status } : {};

    const payments = await Payment.find(filter)
      .populate("userId", "username email phoneNumber")
      .populate("membershipPlanId", "name price duration")
      .populate("reviewedBy", "username email")
      .sort({ createdAt: -1 });

    return messageHandler(
      res,
      200,
      `${payments.length} payment(s) found`,
      payments
    );
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Get All Payments Error: ${error.message}`,
      error
    );
  }
};

// Get user's own payments
const getMyPayments = async (req, res) => {
  try {
    const userId = req.userId;

    const payments = await Payment.find({ userId })
      .populate("membershipPlanId", "name price duration")
      .populate("reviewedBy", "username email")
      .sort({ createdAt: -1 });

    return messageHandler(
      res,
      200,
      `${payments.length} payment(s) found`,
      payments
    );
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Get My Payments Error: ${error.message}`,
      error
    );
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.userId;

    const payment = await Payment.findById(paymentId)
      .populate("userId", "username email phoneNumber")
      .populate("membershipPlanId", "name price duration")
      .populate("reviewedBy", "username email");

    if (!payment) {
      return messageHandler(res, 404, "Payment not found");
    }

    // Check if user is authorized to view this payment
    const user = await User.findById(userId);
    const isAdmin = ["admin", "super admin"].includes(user.role);
    const isOwner = payment.userId._id.toString() === userId;

    if (!isAdmin && !isOwner) {
      return messageHandler(
        res,
        403,
        "Access denied. You can only view your own payments."
      );
    }

    return messageHandler(res, 200, "Payment found", payment);
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Get Payment Error: ${error.message}`,
      error
    );
  }
};

// Admin approves payment
const approvePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const adminId = req.userId;
    const { remarks } = req.body;

    // Validate admin
    const admin = await User.findById(adminId);
    if (!admin || !["admin", "super admin"].includes(admin.role)) {
      return messageHandler(res, 403, "Access denied. Admin only.");
    }

    // Find payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return messageHandler(res, 404, "Payment not found");
    }

    if (payment.status !== "pending") {
      return messageHandler(
        res,
        400,
        `Payment already ${payment.status}. Cannot approve.`
      );
    }

    // Update payment status
    payment.status = "approved";
    payment.reviewedBy = adminId;
    payment.reviewedAt = new Date();
    if (remarks) payment.remarks = remarks;
    await payment.save();

    // Update user's membership plan
    const user = await User.findById(payment.userId);
    if (user) {
      user.membershipPlanId = payment.membershipPlanId;
      user.accountStatus = "Active";
      await user.save();
    }

    return messageHandler(
      res,
      200,
      "Payment approved successfully. User membership updated.",
      payment
    );
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Approve Payment Error: ${error.message}`,
      error
    );
  }
};

// Admin rejects payment
const rejectPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const adminId = req.userId;
    const { remarks } = req.body;

    // Validate admin
    const admin = await User.findById(adminId);
    if (!admin || !["admin", "super admin"].includes(admin.role)) {
      return messageHandler(res, 403, "Access denied. Admin only.");
    }

    // Find payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return messageHandler(res, 404, "Payment not found");
    }

    if (payment.status !== "pending") {
      return messageHandler(
        res,
        400,
        `Payment already ${payment.status}. Cannot reject.`
      );
    }

    // Update payment status
    payment.status = "rejected";
    payment.reviewedBy = adminId;
    payment.reviewedAt = new Date();
    payment.remarks = remarks || "Payment rejected by admin";
    await payment.save();

    return messageHandler(res, 200, "Payment rejected", payment);
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Reject Payment Error: ${error.message}`,
      error
    );
  }
};

// Delete payment (Admin only, for pending payments)
const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user || !["admin", "super admin"].includes(user.role)) {
      return messageHandler(res, 403, "Access denied. Admin only.");
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return messageHandler(res, 404, "Payment not found");
    }

    await Payment.findByIdAndDelete(paymentId);
    return messageHandler(res, 200, "Payment deleted successfully");
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Delete Payment Error: ${error.message}`,
      error
    );
  }
};

module.exports = {
  uploadPaymentSlip,
  getAllPayments,
  getMyPayments,
  getPaymentById,
  approvePayment,
  rejectPayment,
  deletePayment
};
