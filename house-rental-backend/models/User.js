const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner', 'user'], default: 'user' },

  // for workflow
  selectedHouse: { type: mongoose.Schema.Types.ObjectId, ref: 'House', default: null }, // request pending
  bookedHouse: { type: mongoose.Schema.Types.ObjectId, ref: 'House', default: null }, // accepted booking

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
