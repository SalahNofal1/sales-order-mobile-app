import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase/config';

export type Employee = {
  id: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  jobType?: string;
  job?: string;
  salesLine?: string;
};

export type EmployeeProfileData = {
  fullName: string;
  phone: string;
  address: string;
  startDate: string;
  email: string;
  salesLine: string;
  jobType: 'Sales Representative' | 'Warehouse Keeper';
};

export const getEmployees = async (): Promise<Employee[]> => {
  const snapshot = await getDocs(collection(db, 'employees'));
  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  })) as Employee[];
};

export const createEmployeeProfile = async (data: EmployeeProfileData) => {
  const docRef = await addDoc(collection(db, 'employees'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  const snapshot = await getDoc(doc(db, 'employees', id));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Employee;
};

export const updateEmployee = async (id: string, data: Partial<Employee>) => {
  await updateDoc(doc(db, 'employees', id), data);
};

export const deleteEmployee = async (id: string) => {
  await deleteDoc(doc(db, 'employees', id));
};
