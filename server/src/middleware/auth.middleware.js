import admin from "../config/firebase.js";
export const verifyToken = async (req, res, next) => {
  // ✅ Allow CORS preflight requests
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];


    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };
    next();
  } catch (err) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
