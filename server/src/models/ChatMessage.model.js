import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema(
  {
    // 🔒 Anchor to ONE verification case
    verification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Verification',
      required: true
    },

    // Firebase UID of sender
    senderId: {
      type: String,
      required: true
    },

    // Firebase UID of receiver
    receiverId: {
      type: String,
      required: true
    },

    // 🔐 Encrypted message ONLY (backend never sees plaintext)
    ciphertext: {
      type: String,
      required: true
    },

    // Read receipt (optional, safe)
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model('ChatMessage', ChatMessageSchema);
