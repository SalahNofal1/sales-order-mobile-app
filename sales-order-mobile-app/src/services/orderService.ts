import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
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
  customerName?: string;
  deliveryTime?: string; // free text (e.g. "Today 6pm", "2026-05-06 18:00")
};

export type OrderStatus = 'pending' | 'processing' | 'prepared' | 'delivered';

export type OrderDoc = {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
  createdAt?: any;
  items: OrderItem[];
  customerName?: string | null;
  deliveryTime?: string | null;
};

function sanitizeForFirestore<T>(value: T): T {
  if (value === undefined) return null as any;
  if (value === null) return value;
  if (Array.isArray(value)) {
    return value.map((v) => sanitizeForFirestore(v)) as any;
  }
  if (typeof value === 'object') {
    const out: any = {};
    for (const [k, v] of Object.entries(value as any)) {
      if (v === undefined) continue; // drop undefined keys
      out[k] = sanitizeForFirestore(v);
    }
    return out;
  }
  return value;
}

export const createOrder = async ({ userId, total, items, customerName, deliveryTime }: CreateOrderParams) => {
  try {
    const safeItems: OrderItem[] = (items || []).map((it: any) => ({
      name: String(it?.name ?? ''),
      price: Number(it?.price ?? 0),
      quantity: Number(it?.quantity ?? 0),
    }));

    const docRef = await addDoc(collection(db, 'orders'), {
      userId: String(userId),
      total: Number(total ?? 0),
      status: 'pending',
      createdAt: serverTimestamp(),
      items: sanitizeForFirestore(safeItems),
      customerName: customerName ? String(customerName) : null,
      deliveryTime: deliveryTime ? String(deliveryTime) : null,
    });
    return docRef.id;
  } catch (error: any) {
    // Surface Firestore errors (e.g. permission-denied) to UI.
    throw new Error(error?.message || 'Failed to create order.');
  }
};

export const getOrdersByUser = async (userId: string): Promise<OrderDoc[]> => {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as OrderDoc[];
};

export const getAllOrders = async (): Promise<OrderDoc[]> => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as OrderDoc[];
};

export const getOrderById = async (orderId: string): Promise<OrderDoc | null> => {
  const snap = await getDoc(doc(db, 'orders', orderId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as any) } as OrderDoc;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  await updateDoc(doc(db, 'orders', orderId), { status });
};

export const deleteOrder = async (orderId: string) => {
  await deleteDoc(doc(db, 'orders', orderId));
};
