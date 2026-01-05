import Candidate from "../models/Candidate.js";
import axios from "axios";
import { getAuth } from "firebase/auth";

const API = import.meta.env.VITE_API_BASE_URL;

const authHeader = async () => {
  const token = await getAuth().currentUser.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const saveDocumentMeta = async (payload) => {
  const headers = await authHeader();
  return axios.post(`${API}/api/candidate/documents`, payload, { headers });
};
