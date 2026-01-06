import axios from "axios";
import { getAuth } from "firebase/auth";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const authHeader = async () => {
  const user = getAuth().currentUser;
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const saveDocumentMeta = async (data) => {
  const headers = await authHeader();

  const res = await axios.post(
    `${API_BASE_URL}/api/candidate/document`,
    data,
    { headers }
  );

  return res.data;
};
