const mongoose = require ('mongoose')

const businessSchema = new mongoose.Schema({
     name: { type: String }, // e.g., "ABC Marriage Bureau"
    address: String,
    registrationNumber: String, // Business reg proof
    serviceType: [String], // e.g., ["Matrimonial Consulting", "Venue Booking"]
    isApproved: { type: Boolean, default: false }, // Super Admin approves
});

const Business = mongoose.model('Business', businessSchema);
module.exports = {Business}