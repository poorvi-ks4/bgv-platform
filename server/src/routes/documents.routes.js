import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Document from '../models/Document.model.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Ensure uploads directory exists (one level up from src)
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory:', uploadsDir);
}

// Test route
router.get('/test', (req, res) => {
  console.log('✅ Documents route is accessible');
  res.json({ message: 'Documents route working' });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📁 Upload destination:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${unique}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log('📄 File received by multer:', file.originalname);
    cb(null, true);
  }
});

// POST /api/documents/upload
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    console.log('📤 Upload route hit');
    console.log('File:', req.file);
    console.log('Body:', req.body);

    if (!req.file) {
      console.error('❌ No file received');
      return res.status(400).json({ error: 'No file' });
    }

    console.log('✅ File received:', req.file.originalname);

    const doc = new Document({
      userId: req.body.userId || '',
      docType: req.body.docType || 'unknown',
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      status: 'pending'  // Changed from 'uploaded' to 'pending'
    });

    console.log('💾 Saving document to DB:', doc);
    await doc.save();
    console.log('✅ Document saved:', doc._id);
    
    res.json({ _id: doc._id, status: doc.status, filename: doc.filename });
  } catch (err) {
    console.error('❌ Upload error:', err.message, err.stack);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

export default router;