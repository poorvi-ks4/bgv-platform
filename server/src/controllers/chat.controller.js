import ChatMessage from '../models/ChatMessage.model.js';
import User from '../models/User.model.js';

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
    const { candidateId, receiverId, encryptedMessage, nonce, senderRole, senderPublicKey } = req.body;
    const senderId = req.user?.uid;

    console.log('💬 Message from', senderRole);

    if (!senderId || !receiverId || !candidateId || !encryptedMessage || !nonce) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const chatMessage = new ChatMessage({
      candidateId,
      senderId,
      senderRole,
      senderPublicKey,
      receiverId,
      encryptedMessage,
      nonce
    });

    await chatMessage.save();
    console.log('✅ Message saved:', chatMessage._id);

    res.json({ _id: chatMessage._id, createdAt: chatMessage.createdAt });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { candidateId, otherUserId } = req.params;
    const userId = req.user?.uid;

    console.log('📬 Fetching messages for candidate:', candidateId);

    const messages = await ChatMessage.find({
      candidateId,
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
