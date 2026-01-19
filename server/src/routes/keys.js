import express from 'express';
import User from '../models/User.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * Register / update public key for E2EE
 * Called once on login
 */
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { publicKey } = req.body;

    if (!publicKey) {
      return res.status(400).json({ error: 'publicKey required' });
    }

    await User.updateOne(
      { uid: req.user.uid },        // ✅ correct field
      { publicKey },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('❌ key register error:', err);
    res.status(500).json({ error: 'Failed to register key' });
  }
});

/**
 * Fetch public key of another user
 */
router.get('/:uid', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });

    if (!user || !user.publicKey) {
      return res.status(404).json({ error: 'Public key not found' });
    }

    res.json({ publicKey: user.publicKey });
  } catch (err) {
    console.error('❌ key fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch key' });
  }
});

export default router;
