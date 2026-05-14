import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
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
  const normalizedRole = (data.role || 'sales').toLowerCase();
  await setDoc(doc(db, 'employees', userId), {
    ...data,
    role: normalizedRole,
    createdAt: serverTimestamp(),
  });
};

export const getUserProfile = async (uid: string) => {
  const snapshot = await getDoc(doc(db, "employees", uid)); 

  if (snapshot.exists()) {
    return snapshot.data();
  }

  return null;
};
