// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZijeJpfMQeN76Qf12eHs65G3R0r1RUIw",
  authDomain: "rlc2026.firebaseapp.com",
  projectId: "rlc2026",
  storageBucket: "rlc2026.firebasestorage.app",
  messagingSenderId: "262170905940",
  appId: "1:262170905940:web:bbf614aaebc96c76d20cc1",
};

// Initialize Firebase (guarding against re-initialization in Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export { app as firebaseApp };
