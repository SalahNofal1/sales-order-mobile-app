import type { Product } from './productService';

/**
 * Web: expo-sqlite loads WASM via Metro in a way that breaks the default bundle.
 * Offline SQLite cache is native-only; Home still loads from Firebase when online.
 */
export async function replaceCachedProducts(_products: Product[]): Promise<void> {
  // no-op on web
}

export async function getCachedProducts(): Promise<Product[]> {
  return [];
}
