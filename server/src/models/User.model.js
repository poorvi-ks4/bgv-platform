import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    name: String,
    email: String,
    role: {
      type: String,
      enum: ["candidate", "recruiter", "verifier", "admin"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
