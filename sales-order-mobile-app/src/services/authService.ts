import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from './firebase/config';

export const signup = async (email: string, password: string) => {
  const response = await createUserWithEmailAndPassword(auth, email, password);
  return response.user;
};

export const login = async (email: string, password: string) => {
  const response = await signInWithEmailAndPassword(auth, email, password);
  return response.user;
};
