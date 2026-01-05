import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    companyName: String,
    designation: String,

    duration: {
      from: Date,
      to: Date,
    },

    experienceLetterUrl: String,

    hrContact: {
      name: String,
      email: String,
      phone: String,
    },

    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    verifierRemarks: String,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);
