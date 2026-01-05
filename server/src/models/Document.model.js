import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
  name: { type: String },
  storagePath: { type: String },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);
