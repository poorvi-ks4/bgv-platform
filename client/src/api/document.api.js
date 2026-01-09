import axios from "axios";
import { getAuth } from "firebase/auth";

const API_BASE = "http://51.21.134.155:5000";
;

const authHeader = async () => {
  const user = getAuth().currentUser;
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const saveDocumentMeta = async (data) => {
  const headers = await authHeader();

  const res = await axios.post(
    `${API_BASE}/api/candidate/document`,
    data,
    { headers }
  );

  return res.data;
};
