import express from "express";
import {
  sendMessage,
  getMessages,
  getChatPartner,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Routes
router.post("/send", verifyToken, sendMessage);
router.get("/messages/:candidateId/:otherUserId", verifyToken, getMessages);
router.get("/partner/:candidateId", verifyToken, getChatPartner);

export default router;
