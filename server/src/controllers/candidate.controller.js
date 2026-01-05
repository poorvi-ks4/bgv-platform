import Candidate from "../models/Candidate.model.js";

export const savePersonalDetails = async (req, res) => {
  try {
    console.log("📥 Candidate details body:", req.body);
    console.log("👤 Firebase UID:", req.user.uid);

    const { name, email, phone, address } = req.body;
    const firebaseUid = req.user.uid;

    const candidate = await Candidate.findOneAndUpdate(
      { firebaseUid },
      {
        firebaseUid,
        personalDetails: { name, email, phone, address },
      },
      { upsert: true, new: true }
    );

    return res.status(200).json(candidate);
  } catch (err) {
    console.error("❌ Candidate save error:", err);
    return res.status(500).json({ message: "Failed to save details" });
  }
};
