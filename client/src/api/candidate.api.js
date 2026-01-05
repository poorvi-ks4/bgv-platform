import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
//const API_BASE_URL =import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const waitForFirebaseUser = () =>
  new Promise((resolve, reject) => {
    const auth = getAuth();

    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }
console.log("🔥 ENV API URL:", import.meta.env.VITE_API_BASE_URL);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) resolve(user);
      else reject(new Error("Firebase user not available"));
    });
  });

const authHeader = async () => {

  const user = await waitForFirebaseUser();
  const token = await user.getIdToken(true);
    console.log("🔥 SENDING TOKEN:", token.slice(0, 20), "...");

  return { Authorization: `Bearer ${token}` };
};
export const savePersonalDetails = async (data) => {
  console.log("📤 Sending personal details:", data);

  const headers = await authHeader();

  console.log("🧪 Auth header being sent:", headers);

  const res = await axios.put(
    `${API_BASE_URL}/api/candidate/details`,
    data,
    { headers }
  );

  return res.data;
};

/*
export const getMyProfile = async () => {
  const headers = await authHeader();
  const res = await axios.get(
    `${API_BASE_URL}/api/candidate/me`,
    { headers }
  );
  return res.data;
};

*/