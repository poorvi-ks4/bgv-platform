import express from "express";
import {
  sendMessage,
  getMessagesByVerification,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Send encrypted message
 * body: { verificationId, to, ciphertext }
 */
router.post("/send", verifyToken, sendMessage);

/**
 * Get messages for ONE verification case
 * params: verificationId, otherUserUid
 */
router.get(
  "/:verificationId/:otherUserUid",
  verifyToken,
  getMessagesByVerification
);

export default router;
