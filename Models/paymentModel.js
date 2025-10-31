const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  membershipPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MembershipPlan",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentSlipUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    default: "Bank Transfer",
  },
  transactionId: {
    type: String,
  },
  remarks: {
    type: String,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviewedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = { Payment };
