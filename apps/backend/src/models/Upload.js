const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String },
  size: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Upload', uploadSchema);
