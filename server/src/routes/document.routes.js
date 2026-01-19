import express from "express";
import upload from "../middleware/multer.middleware.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { uploadDocument } from "../controllers/document.controller.js";
import { downloadDocument } from "../controllers/document.controller.js";
const router = express.Router();

router.post(
  "/upload",
  verifyToken,
  upload.single("file"),
  uploadDocument
);
router.get("/download/:id",downloadDocument);
router.get("/test", (req, res) => {
  res.json({ ok: true });
});

export default router;
