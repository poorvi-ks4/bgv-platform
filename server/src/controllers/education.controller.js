import Education from "../models/education.model.js";
import Candidate from "../models/Candidate.model.js";

export const addEducation = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user: req.user._id });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const education = await Education.create({
      candidate: candidate._id,
      ...req.body,
    });

    res.status(201).json(education);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
