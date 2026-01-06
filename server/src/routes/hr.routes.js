import express from 'express';
import Candidate from '../models/Candidate.model.js';
import Document from '../models/Document.model.js';

const router = express.Router();

// GET all candidates with their documents
router.get('/candidates', async (req, res) => {
  try {
    console.log('📋 Fetching all candidates');
    const candidates = await Candidate.find().lean();
    
    // Fetch documents for each candidate
    const candidatesWithDocs = await Promise.all(
      candidates.map(async (candidate) => {
        const documents = await Document.find({ userId: candidate.userId });
        return {
          ...candidate,
          documents
        };
      })
    );

    res.json(candidatesWithDocs);
  } catch (err) {
    console.error('❌ Error fetching candidates:', err);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// PUT notes for a candidate
router.put('/candidates/:id/notes', async (req, res) => {
  try {
    const { notes } = req.body;
    console.log('📝 Saving notes for candidate:', req.params.id);

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { notes },
      { new: true }
    );

    res.json({ message: 'Notes saved', candidate });
  } catch (err) {
    console.error('❌ Error saving notes:', err);
    res.status(500).json({ error: 'Failed to save notes' });
  }
});

// PUT approve document
router.put('/documents/:id/approve', async (req, res) => {
  try {
    console.log('✅ Approving document:', req.params.id);

    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedAt: new Date() },
      { new: true }
    );

    res.json({ message: 'Document approved', doc });
  } catch (err) {
    console.error('❌ Error approving document:', err);
    res.status(500).json({ error: 'Failed to approve document' });
  }
});

// PUT decline document
router.put('/documents/:id/decline', async (req, res) => {
  try {
    const { reason } = req.body;
    console.log('❌ Declining document:', req.params.id);

    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { status: 'declined', declineReason: reason, declinedAt: new Date() },
      { new: true }
    );

    res.json({ message: 'Document declined', doc });
  } catch (err) {
    console.error('❌ Error declining document:', err);
    res.status(500).json({ error: 'Failed to decline document' });
  }
});

export default router;