import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase/config';

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
};

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  })) as Product[];
};

type CreateProductInput = {
  name: string;
  price: number;
  description?: string;
  imageUri?: string;
};

const uploadProductImage = async (imageUri: string): Promise<string> => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const imageRef = ref(storage, fileName);
  await uploadBytes(imageRef, blob, { contentType: 'image/jpeg' });
  return getDownloadURL(imageRef);
};

export const createProduct = async ({
  name,
  price,
  description,
  imageUri,
}: CreateProductInput) => {
  try {
    let image: string | undefined;
    if (imageUri) {
      image = await uploadProductImage(imageUri);
    }

    const docRef = await addDoc(collection(db, 'products'), {
      name,
      price,
      description: description || '',
      image: image || '',
      createdAt: Date.now(),
    });

    return docRef.id;
  } catch (error: any) {
    throw new Error(error?.message || 'Unable to create product.');
  }
};

export const updateProduct = async (
  id: string,
  data: { name: string; price: number; description?: string; imageUri?: string }
) => {
  let nextImage: string | undefined;
  if (data.imageUri) {
    nextImage = await uploadProductImage(data.imageUri);
  }

  await updateDoc(doc(db, 'products', id), {
    name: data.name,
    price: data.price,
    description: data.description || '',
    ...(nextImage ? { image: nextImage } : {}),
  });
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, 'products', id));
};
