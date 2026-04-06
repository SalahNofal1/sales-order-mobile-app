import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

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

export const createOrder = async ({
  userId,
  total,
  items,
}: CreateOrderParams) => {
  const ordersRef = collection(db, 'orders');

  const newOrder = {
    userId,
    total,
    status: 'pending',
    createdAt: Date.now(),
    items,
  };

  const docRef = await addDoc(ordersRef, newOrder);
  return docRef.id;
};