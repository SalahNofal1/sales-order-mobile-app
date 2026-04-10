import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase/config';

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type CreateOrderParams = {
  userId: string;
  total: number;
  items: OrderItem[];
};

export const createOrder = async ({ userId, total, items }: CreateOrderParams) => {
  const docRef = await addDoc(collection(db, 'orders'), {
    userId,
    total,
    status: 'pending',
    createdAt: serverTimestamp(),
    items,
  });
  return docRef.id;
};
