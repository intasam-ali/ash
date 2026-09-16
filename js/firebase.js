/* =========================
   GEN.Z GADGETS
   Firebase Configuration & Functions
========================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDZRn0KADLkLTexwzOpnqR-VKzRqQKPUGY",
    authDomain: "genz-gadgets.firebaseapp.com",
    projectId: "genz-gadgets",
    storageBucket: "genz-gadgets.firebasestorage.app",
    messagingSenderId: "473246555348",
    appId: "1:473246555348:web:9944b3fc49a8a57e966f41"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Make global for non-module scripts
window.firebaseDB = {
    db,
    auth,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    updateDoc,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
};

console.log('✅ FIREBASE INITIALIZED with Auth');
