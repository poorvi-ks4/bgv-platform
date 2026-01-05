import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    degree: String,
    institution: String,
    university: String,
    regNumber: String,

    duration: {
      from: Number,
      to: Number,
    },

    certificateUrl: String,

    instituteContact: {
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

export default mongoose.model("Education", educationSchema);
