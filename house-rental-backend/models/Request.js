const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true },
  status: { type: String, enum: ['pending','accepted','rejected','withdrawn'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
