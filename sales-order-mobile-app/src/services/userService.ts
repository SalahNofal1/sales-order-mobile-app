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
  await setDoc(doc(db, 'employees', userId), {
    ...data,
    role: data.role || "sales",
    createdAt: serverTimestamp(),
  });
};

export const getUserProfile = async (uid: string) => {
  const snapshot = await getDoc(doc(db, "employees", uid)); 

  if (snapshot.exists()) {
    return snapshot.data();
  }

  throw new Error("Employee not found");
};
