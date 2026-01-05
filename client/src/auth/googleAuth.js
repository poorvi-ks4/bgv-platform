import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const googleLogin = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const token = await result.user.getIdToken();
  return {
    user: result.user,
    token
  };
};
