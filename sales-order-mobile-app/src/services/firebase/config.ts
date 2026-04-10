import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCnhlaQ4GzxdxLLKpr8pCX84tQsb5T974',
  authDomain: 'salesordermobileapp.firebaseapp.com',
  projectId: 'salesordermobileapp',
  storageBucket: 'salesordermobileapp.firebasestorage.app',
  messagingSenderId: '463938588174',
  appId: '1:463938588174:web:e9137e1326c489507ef65f',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);