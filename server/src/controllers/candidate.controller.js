import Candidate from "../models/Candidate.model.js";

/**
 * Save personal details
 */
export const savePersonalDetails = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const userId = req.user?.uid; // Get UID from Firebase token

    console.log("📥 savePersonalDetails called");
    console.log("🆔 UserID:", userId);
    console.log("📋 Details:", { name, email, phone, address });

    if (!userId) {
      return res.status(400).json({ error: "User ID not found" });
    }

    // Check if candidate already exists
    let candidate = await Candidate.findOne({ userId });

    if (candidate) {
      // Update existing candidate
      candidate.name = name;
      candidate.email = email;
      candidate.phone = phone;
      candidate.address = address;
      await candidate.save();
      console.log("✅ Candidate updated:", userId);
    } else {
      // Create new candidate
      candidate = new Candidate({
        userId,
        name,
        email,
        phone,
        address,
        notes: "",
        status: "pending",
      });
      await candidate.save();
      console.log("✅ Candidate created:", userId);
    }

    res.json({ message: "Personal details saved", candidate });
  } catch (err) {
    console.error("❌ savePersonalDetails error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Save document metadata (file already uploaded to Firebase)
 */
export const saveDocument = async (req, res) => {
  try {
    console.log("📥 saveDocument called");

    const { type, fileUrl } = req.body;
    const firebaseUid = req.user.uid;

    const candidate = await Candidate.findOne({ firebaseUid });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.documents[type] = {
      url: fileUrl,
      status: "pending",
      uploadedAt: new Date(),
    };

    await candidate.save();

    res.json({ success: true });
  } catch (err) {
    console.error("❌ saveDocument error:", err);
    res.status(500).json({ message: "Failed to save document" });
  }
};
