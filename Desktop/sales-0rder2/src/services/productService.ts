import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
} from 'firebase/firestore';

import { db } from './firebase/config';

export type Product = {
  id?: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  quantity: number;
};

const col = collection(db, 'products');

export const createProduct = async (product: Product) => {
  await addDoc(col, product);
};

export const getProducts = async () => {
  const snapshot = await getDocs(col);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, 'products', id));
};

export const updateProduct = async (id: string, product: any) => {
  await updateDoc(doc(db, 'products', id), product);
};