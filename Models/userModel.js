const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, require: true },
  email:{type:String, require :true},
  phoneNumber: { type: String, require: true, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["super admin", "admin", "customer"],
    default: "customer",
  },
  membershipPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MembershipPlan",
  },

  accountStatus: {
    type: String,
    enum: ["Active", "Inactive", "Suspended"],
    default: "Inactive",
  },
  profilePicUrl: String,
  businessId: [{type:mongoose.Schema.Types.ObjectId , ref:"Business"}],
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  createdAt: { type: Date, default: Date.now() },
  lastLoginAt: { type: Date, default: Date.now() },
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
