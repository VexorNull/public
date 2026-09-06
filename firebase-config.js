import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1S9u1f3VOdZnP6puMhCVwAG6kwL4Vu5Q",
  authDomain: "public-361f0.firebaseapp.com",
  projectId: "public-361f0",
  storageBucket: "public-361f0.firebasestorage.app",
  messagingSenderId: "519361882049",
  appId: "1:519361882049:web:fa1d69dff9d59df4f43140",
  measurementId: "G-25WKCZG3EF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Authentication ensure karne ke liye (Secure uploads)
signInAnonymously(auth).catch((error) => {
    console.error("Auth error:", error);
});
