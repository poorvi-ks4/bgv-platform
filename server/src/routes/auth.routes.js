import express from 'express';
import { login } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/login', (req, res, next) => {
  console.log('✅ /api/auth/login HIT');
  next();
}, verifyToken, login);

router.options('/login', (req, res) => res.sendStatus(200));
router.post('/login', verifyToken, login);

export default router;
