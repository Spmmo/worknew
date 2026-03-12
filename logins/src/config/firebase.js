import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-jpyrR7-2buoISGPHT3yf4ZmHjQ8_bH8",
  authDomain: "thamkapphuean.firebaseapp.com",
  projectId: "thamkapphuean",
  storageBucket: "thamkapphuean.firebasestorage.app",
  messagingSenderId: "108762807643",
  appId: "1:108762807643:web:f595f6dcadf20ce41dae7e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const db = getFirestore(app);
// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
