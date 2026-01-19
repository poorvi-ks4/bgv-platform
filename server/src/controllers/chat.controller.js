import ChatMessage from '../models/ChatMessage.model.js';
import User from '../models/User.model.js';
import Verification from '../models/Verification.model.js';
export const getChatPartner = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const userRole = req.user?.role || 'hr';

    console.log('🔍 Finding chat partner for candidate:', candidateId);
    console.log('👤 Current user role:', userRole);

    // If HR, find a verifier. If Verifier, find HR
    const partner = await User.findOne({
      role: userRole === 'hr' ? 'verifier' : 'hr'
    });

    if (!partner) {
      console.log('❌ No partner found');
      return res.status(404).json({ error: 'Chat partner not found' });
    }

    console.log('✅ Partner found:', partner.uid);
    res.json({ partnerId: partner.uid, partnerName: partner.name });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { verificationId, to, ciphertext } = req.body;
    const from = req.user.uid;

    if (!verificationId || !to || !ciphertext) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // 🔒 Ensure sender is part of this verification
    const verification = await Verification.findById(verificationId);

    if (!verification) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    const isHR = req.user.role === 'hr';
    const isVerifier =
      verification.assignedTo &&
      verification.assignedTo.toString() === req.user._id?.toString();

    if (!isHR && !isVerifier) {
      return res.status(403).json({ error: 'Not authorized for this case' });
    }

    const chatMessage = await ChatMessage.create({
      verification: verificationId,
      senderId: from,
      receiverId: to,
      ciphertext
    });

    res.json({
      _id: chatMessage._id,
      createdAt: chatMessage.createdAt
    });
  } catch (err) {
    console.error('❌ sendMessage error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

/**
 * Get messages for ONE verification
 * params: verificationId, otherUserUid
 */
export const getMessagesByVerification = async (req, res) => {
  try {
    const { verificationId, otherUserUid } = req.params;
    const userUid = req.user.uid;

    const verification = await Verification.findById(verificationId);

    if (!verification) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    const isHR = req.user.role === 'hr';
    const isVerifier =
      verification.assignedTo &&
      verification.assignedTo.toString() === req.user._id?.toString();

    if (!isHR && !isVerifier) {
      return res.status(403).json({ error: 'Not authorized for this case' });
    }

    const messages = await ChatMessage.find({
      verification: verificationId,
      $or: [
        { senderId: userUid, receiverId: otherUserUid },
        { senderId: otherUserUid, receiverId: userUid }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('❌ getMessages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
