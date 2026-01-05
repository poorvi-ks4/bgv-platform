import Candidate from "../models/Candidate.js";

export const saveDocument = async (req, res) => {
  try {
    const { type, url } = req.body;
    const firebaseUid = req.user.uid;

    const update = {
      [`documents.${type}`]: {
        url,
        status: "pending",
        uploadedAt: new Date(),
      },
    };

    const candidate = await Candidate.findOneAndUpdate(
      { firebaseUid },
      { $set: update },
      { new: true, upsert: true }
    );

    res.json(candidate);
  } catch (err) {
    console.error("Save document failed:", err);
    res.status(500).json({ message: "Document save failed" });
  }
};
