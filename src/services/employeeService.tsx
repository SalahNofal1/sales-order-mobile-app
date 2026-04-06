import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface EmployeeProfileData {
  fullName: string;
  phone: string;
  address: string;
  startDate: string;
  email: string;
  salesLine: string;
  jobType: 'Sales Representative' | 'Warehouse Keeper';
}

export const createEmployeeProfile = async (data: EmployeeProfileData) => {
  try {
    const docRef = await addDoc(collection(db, 'employees'), {
      ...data,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating employee profile:', error);
    throw error;
  }
};