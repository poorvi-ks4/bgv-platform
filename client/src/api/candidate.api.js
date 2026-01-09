import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import API_BASE_URL from "./api.config";

/* =========================
   WAIT FOR FIREBASE USER
========================= */
const waitForFirebaseUser = () =>
  new Promise((resolve, reject) => {
    const auth = getAuth();

    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) resolve(user);
      else reject(new Error("Firebase user not available"));
    });
  });

/* =========================
   AUTH HEADER
========================= */
const authHeader = async () => {
  const user = await waitForFirebaseUser();
  const token = await user.getIdToken(true);

  return { Authorization: `Bearer ${token}` };
};

/* =========================
   SAVE PERSONAL DETAILS
========================= */
export const savePersonalDetails = async (data) => {
  const headers = await authHeader();

  const res = await axios.put(
    `${API_BASE_URL}/api/candidate/details`,
    data,
    { headers }
  );

  return res.data;
};

/* =========================
   UPLOAD DOCUMENT
========================= */
export const uploadDocument = async ({ token, formData }) => {
  const res = await fetch(
    `${API_BASE_URL}/api/documents/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
        // ❌ do NOT set Content-Type for FormData
      },
      body: formData
    }
  );

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json();
};
