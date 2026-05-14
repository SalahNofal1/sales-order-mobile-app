import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { auth } from './firebase/config';
import { firebaseConfig } from './firebase/config';

export const signup = async (email: string, password: string) => {
  const response = await createUserWithEmailAndPassword(auth, email, password);
  return response.user;
};

export const login = async (email: string, password: string) => {
  const response = await signInWithEmailAndPassword(auth, email, password);
  return response.user;
};

function getSecondaryAuth() {
  const name = 'secondary-auth';
  const app =
    getApps().find((a) => a.name === name) ||
    (() => {
      try {
        return getApp(name);
      } catch {
        return initializeApp(firebaseConfig, name);
      }
    })();

  return getAuth(app);
}

export const createUserAsAdmin = async (email: string, password: string) => {
  const secondaryAuth = getSecondaryAuth();
  const res = await createUserWithEmailAndPassword(secondaryAuth, email, password);
  await signOut(secondaryAuth);
  return res.user;
};

export const sendResetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const logout = async () => {
  await signOut(auth);
};
