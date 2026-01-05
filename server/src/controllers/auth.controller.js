import User from "../models/User.model.js";

export const login = async (req, res) => {
  try {
    const { role } = req.body;
    const { uid, email, name } = req.user; // 👈 FROM MIDDLEWARE

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name,
        role,
      });
    }

    res.json({ user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
