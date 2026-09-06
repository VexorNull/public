// Firebase Auth Module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1S9u1f3VOdZnP6puMhCVwAG6kwL4Vu5Q",
    authDomain: "public-361f0.firebaseapp.com",
    projectId: "public-361f0",
    storageBucket: "public-361f0.firebasestorage.app",
    messagingSenderId: "519361882049",
    appId: "1:519361882049:web:fa1d69dff9d59df4f43140",
    measurementId: "G-25WKCZG3EF"
};

// Initialize Firebase App & Auth
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Global State
export let currentUser = null;

// Admin Login Handler
export async function loginAdmin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Logout Handler
export async function logoutAdmin() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Real-time Auth State Observer
export function initAuthObserver(onStateChange) {
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        onStateChange(user);
    });
}
