import Chat from '../models/Chat.model.js';

export const getChatsForUser = async (req, res) => {
  const uid = req.user?.uid;
  if (!uid) return res.status(401).json({ message: 'Unauthorized' });

  const chats = await Chat.find({ participants: uid }).limit(50);
  res.json(chats);
};

export const postMessage = async (req, res) => {
  const uid = req.user?.uid;
  const { chatId } = req.params;
  const { text } = req.body;
  if (!uid) return res.status(401).json({ message: 'Unauthorized' });

  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).json({ message: 'Chat not found' });
  chat.messages.push({ sender: uid, text });
  await chat.save();
  res.json(chat);
};

export default { getChatsForUser, postMessage };
