import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    personalDetails: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", CandidateSchema);
