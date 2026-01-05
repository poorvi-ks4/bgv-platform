import express from "express";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * TEMP handlers (to avoid crashes)
 * We'll implement real logic later
 */
const getChatsForUser = (req, res) => {
  res.json({ chats: [] });
};

const sendMessage = (req, res) => {
  res.json({ success: true });
};

// Routes
router.get("/", verifyFirebaseToken, getChatsForUser);
router.post("/send", verifyFirebaseToken, sendMessage);

export default router;
