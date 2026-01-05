import express from "express";
import { addEducation } from "../controllers/education.controller.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  verifyFirebaseToken,
  requireRole("candidate"),
  addEducation
);

export default router;
