// Placeholder for verification-related API calls
import axios from 'axios';

export const submitDocument = (candidateId, formData) => axios.post(`/api/verification/${candidateId}/documents`, formData);
export const getVerificationStatus = (id) => axios.get(`/api/verification/${id}`);
