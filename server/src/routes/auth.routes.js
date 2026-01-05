import express from "express";
import { login } from "../controllers/auth.controller.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", verifyFirebaseToken, login);

export default router;
