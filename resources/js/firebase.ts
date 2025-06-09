import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
} from 'firebase/auth';
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDLriQABQaRn-m9RqYDyY5hsHplumVMlS0",
    authDomain: "lengzem-app-bd7eb.firebaseapp.com",
    projectId: "lengzem-app-bd7eb",
    storageBucket: "lengzem-app-bd7eb.firebasestorage.app",
    messagingSenderId: "433437777350",
    appId: "1:433437777350:web:98da605454beb864a526c7",
    measurementId: "G-3WRPT9H8VQ"
  };

// ✅ Only initialize Firebase if it hasn't been already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, signInWithPopup, db };

