const mongoose = require('mongoose');

const EncryptedMessageSchema = new mongoose.Schema({
  caseId: mongoose.Schema.Types.ObjectId,
  documentId: mongoose.Schema.Types.ObjectId,
  from: String, // firebase UID
  to: String,   // firebase UID
  ciphertext: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EncryptedMessage', EncryptedMessageSchema);
