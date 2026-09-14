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

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
    apiKey: "AIzaSyDZRn0KADLkLTexwzOpnqR-VKzRqQKPUGY",
    authDomain: "genz-gadgets.firebaseapp.com",
    projectId: "genz-gadgets",
    storageBucket: "genz-gadgets.firebasestorage.app",
    messagingSenderId: "473246555348",
    appId: "1:473246555348:web:9944b3fc49a8a57e966f41"
};

// ===== INITIALIZE =====
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== MAKE GLOBAL (for non-module scripts) =====
window.firebaseDB = {
    db,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    updateDoc
};

console.log('✅ FIREBASE INITIALIZED');
