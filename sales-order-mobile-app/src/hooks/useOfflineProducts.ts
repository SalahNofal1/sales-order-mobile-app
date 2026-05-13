import { useCallback, useEffect, useState } from 'react';

import { getCachedProducts, replaceCachedProducts } from '../services/salesHomeProductsCache';
import { getProducts, type Product } from '../services/productService';
import { getErrorMessage } from '../utils/errorMessage';

export type OfflineProductsState = {
  products: Product[];
  offline: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

/**
 * Loads products from Firebase when online, caches to SQLite, and falls back to SQLite when offline.
 */
export function useOfflineProducts(): OfflineProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [offline, setOffline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getProducts();
      setProducts(list);
      setOffline(false);
      try {
        await replaceCachedProducts(list);
      } catch (cacheError) {
        setError(getErrorMessage(cacheError, 'Could not update offline copy (SQLite).'));
      }
    } catch (networkError) {
      try {
        const cached = await getCachedProducts();
        setProducts(cached);
        setOffline(true);
        if (cached.length === 0) {
          setError(getErrorMessage(networkError, 'No connection and no saved products yet.'));
        }
      } catch (sqliteError) {
        setProducts([]);
        setOffline(true);
        setError(
          getErrorMessage(
            sqliteError,
            getErrorMessage(networkError, 'Could not load products.')
          )
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { products, offline, loading, error, refresh };
}
