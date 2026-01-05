// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8sCOvNG1RFRoFptyNddcHLtezpX51arE",
  authDomain: "bgv-platform.firebaseapp.com",
  projectId: "bgv-platform",
  storageBucket: "bgv-platform.firebasestorage.app",
  messagingSenderId: "948447269386",
  appId: "1:948447269386:web:f3e7d3b3915d90310a05f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
