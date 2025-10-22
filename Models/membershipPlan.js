const mongoose = require('mongoose')
const membershipPlanSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Basic", "Premium"
  price: { type: Number, required: true }, // Monthly/Yearly
  duration: { type: String, enum: ["Monthly", "Yearly"] },
  features: [String], // e.g., ["Unlimited Matches", "Priority Support"]
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
const MembershipPlan = mongoose.model("MembershipPlan", membershipPlanSchema);
module.exports = { MembershipPlan };

