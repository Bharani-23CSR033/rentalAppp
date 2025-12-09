const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  photos: [{ type: String }], // file paths or urls
  cost: { type: Number, required: true },
  description: { type: String },
  location: { type: String, required: true },
  furnishing: { type: String }, // eg 'furnished', 'semi-furnished', 'unfurnished'
  isAvailable: { type: Boolean, default: true },
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // userIds who requested
  acceptedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('House', houseSchema);
