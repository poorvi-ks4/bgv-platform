import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  candidateId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderRole: { type: String, enum: ['hr', 'verifier'], required: true },
  senderPublicKey: { type: String },
  receiverId: { type: String, required: true },
  encryptedMessage: { type: String, required: true },
  nonce: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ChatMessage', ChatMessageSchema);