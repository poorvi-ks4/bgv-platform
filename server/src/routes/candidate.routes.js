import express from "express";
import { savePersonalDetails } from "../controllers/candidate.controller.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.put(
  "/details",
  verifyFirebaseToken,
 // requireRole("candidate"),
  savePersonalDetails
);
router.post(
  "/documents",
  verifyFirebaseToken,
 // requireRole("candidate"),
  saveDocument
);

export default router;
