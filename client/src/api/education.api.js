import axios from "axios";
import { getAuth } from "firebase/auth";

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Helper: Get Firebase ID token
 */
const getAuthHeader = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * ➕ Add Education Details
 * POST /api/education
 */
export const addEducation = async (educationData) => {
  const headers = await getAuthHeader();

  const response = await axios.post(
    `${API_BASE_URL}/api/education`,
    educationData,
    { headers }
  );

  return response.data;
};

/**
 * 📄 Get Logged-in Candidate Education Records
 * GET /api/education/me
 */
export const getMyEducation = async () => {
  const headers = await getAuthHeader();

  const response = await axios.get(
    `${API_BASE_URL}/api/education/me`,
    { headers }
  );

  return response.data;
};

/**
 * 🗑️ Delete Education (optional – if allowed)
 * DELETE /api/education/:id
 */
export const deleteEducation = async (educationId) => {
  const headers = await getAuthHeader();

  const response = await axios.delete(
    `${API_BASE_URL}/api/education/${educationId}`,
    { headers }
  );

  return response.data;
};
