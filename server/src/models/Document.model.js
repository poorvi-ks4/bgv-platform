import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docType: { type: String, required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String },
  size: { type: Number },
  path: { type: String },
  status: { 
    type: String, 
    enum: ['uploaded', 'pending', 'approved', 'declined'], 
    default: 'pending' 
  },
  declineReason: { type: String },
  approvedAt: { type: Date },
  declinedAt: { type: Date },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Document', DocumentSchema);