import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export const getEmployees = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'employees'));

    return snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));
  } catch (error) {
    console.log('Error fetching employees:', error);
    return [];
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'employees', id));
  } catch (error) {
    console.log('Error deleting employee:', error);
  }
};