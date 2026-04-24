import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNhlaQ4GzxdxllLKpr8pcX84tQSb5I974",
  authDomain: "salesordermobileapp.firebaseapp.com",
  projectId: "salesordermobileapp",
  storageBucket: "salesordermobileapp.appspot.com",
  messagingSenderId: "463938588174",
  appId: "1:463938588174:web:9b03904010f12c797ef65f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);