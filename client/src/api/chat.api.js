// Placeholder for chat-related API calls
import axios from 'axios';

export const fetchMessages = (conversationId) => axios.get(`/api/chat/${conversationId}/messages`);
export const sendMessage = (conversationId, body) => axios.post(`/api/chat/${conversationId}/messages`, body);
