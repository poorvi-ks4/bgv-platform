import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // firebase UID
  docType: { type: String, required: true }, // aadhaar, pan, etc

  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: String,
  size: Number,
  path: String,

  status: {
    type: String,
    enum: ["pending", "approved", "declined"],
    default: "pending"
  },

  declineReason: String,
  approvedAt: Date,
  declinedAt: Date,

  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Document", DocumentSchema);
