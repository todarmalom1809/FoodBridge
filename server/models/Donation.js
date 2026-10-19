const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodName: { type: String, required: true },
  quantity: { type: String, required: true },
  description: String,
  photoUrl: String,
  pickupLocation: { type: String, required: true },
  pickupTime: { type: String, required: true },
  foodType: { type: String, enum: ['human', 'animal', 'both'], default: 'human' },
  status: { type: String, enum: ['available', 'claimed', 'picked_up', 'distributed'], default: 'available' },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveredTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  distributionProof: String,
  completedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
