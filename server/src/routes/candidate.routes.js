import express from "express";
import { savePersonalDetails } from "../controllers/candidate.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.put("/details", verifyToken, savePersonalDetails);

export default router;
