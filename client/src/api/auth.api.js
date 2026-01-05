// Placeholder for auth-related API calls (axios wrappers)
import axios from 'axios';

export const login = (payload) => axios.post('/api/auth/login', payload);
export const logout = () => axios.post('/api/auth/logout');
