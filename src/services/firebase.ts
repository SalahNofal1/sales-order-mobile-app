import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCNhlaQ4GzxdxllLKpr8pcX84tQSb5I974",
  authDomain: "salesordermobileapp.firebaseapp.com",
  projectId: "salesordermobileapp",
  storageBucket: "salesordermobileapp.firebasestorage.app",
  messagingSenderId: "463938588174",
  appId: "1:463938588174:web:e9137e1326c489507ef65f",
};

// 🔥 أهم سطر
const app = initializeApp(firebaseConfig);

// 🔥 Firestore
export const db = getFirestore(app);