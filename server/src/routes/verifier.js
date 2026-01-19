const express = require('express');
const crypto = require('crypto');
const VerifierInvite = require('../models/VerifierInvite');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/invite', auth, async (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');

  await VerifierInvite.create({
    candidateId: req.body.candidateId,
    documentId: req.body.documentId,
    verifierEmail: req.body.verifierEmail,
    verifierType: req.body.verifierType,
    token,
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
  });

  console.log(`Invite link: http://localhost:3000/verify/${token}`);
  res.json({ success: true });
});

router.get('/validate/:token', async (req, res) => {
  const invite = await VerifierInvite.findOne({
    token: req.params.token,
    used: false,
    expiresAt: { $gt: new Date() }
  });

  if (!invite) return res.status(400).json({ error: 'Invalid invite' });
  res.json(invite);
});

module.exports = router;
