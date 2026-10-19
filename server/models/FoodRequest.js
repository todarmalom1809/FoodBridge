const mongoose = require('mongoose');

const foodRequestSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodType: { type: String, enum: ['human', 'animal'], required: true },
  foodDescription: { type: String, required: true },
  quantity: { type: String, required: true },
  requiredDate: { type: Date, required: true },
  status: { type: String, enum: ['open', 'fulfilled', 'closed'], default: 'open' },
  fulfilledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation' },
}, { timestamps: true });

module.exports = mongoose.model('FoodRequest', foodRequestSchema);
