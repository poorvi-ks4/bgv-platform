import express from "express";
import { addEducation } from "../controllers/education.controller.js";
import { requireRole } from "../middleware/role.middleware.js";
import { verifyToken } from "../middleware/auth.middleware.js"
const router = express.Router();

router.post(
  "/",
verifyToken,
  requireRole("candidate"),
  addEducation
);

export default router;
