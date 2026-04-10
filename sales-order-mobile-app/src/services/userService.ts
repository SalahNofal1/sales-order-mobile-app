import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase/config';

export type UserProfileInput = {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  jobType?: string;
  role?: string;
  salesLine?: string;
  startDate?: string;
};

export const createUserProfile = async (userId: string, data: UserProfileInput) => {
  await setDoc(doc(db, 'employees', userId), {
    ...data,
    createdAt: serverTimestamp(),
  });
};
