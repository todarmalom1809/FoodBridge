const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['donor', 'ngo', 'organization'], required: true },
  address: String,
  contact: String,
  // NGO fields
  ngoName: String,
  ngoType: String,
  // Organization fields
  orgName: String,
  orgType: { type: String, enum: ['human', 'animal'] },
  orgCategory: String,
  peopleServed: Number,
  orgPhoto: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
