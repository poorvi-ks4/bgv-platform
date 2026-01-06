import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", CandidateSchema);
