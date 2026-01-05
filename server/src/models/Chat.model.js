import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // uid
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }], // array of uids
  messages: [messageSchema],
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);
