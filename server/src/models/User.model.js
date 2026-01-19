import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String },
    role: {
      type: String,
      enum: ["candidate", "hr", "recruiter", "verifier","verifier_external"],
      required: true,
    },
publicKey: {
      type: String, // base64
    },

    // Optional: helps audits
    verifierType: {
      type: String,
      enum: [
        "school_principal",
        "college_registrar",
        "previous_employer",
        "government"
      ],
    },
    createdAt: { type: Date, default: Date.now },
  },

  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
