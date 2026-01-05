import admin from "../config/firebase.js";
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    console.log("🧪 Auth Header:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No Bearer token");
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🧪 Token received (first 20 chars):", token.slice(0, 20));

    const decodedToken = await admin.auth().verifyIdToken(token);

    console.log("✅ Firebase decoded UID:", decodedToken.uid);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };

    next();
  } catch (err) {
    console.error("🔥 Firebase verify error FULL:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
