import { useCallback, useEffect, useState } from 'react';

import { getProducts, type Product } from '../services/productService';
import { getErrorMessage } from '../utils/errorMessage';

export type UseProductsResult = {
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

/**
 * Fetches the product catalog from Firebase with loading / error state.
 */
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getProducts();
      setProducts(list);
    } catch (err) {
      setProducts([]);
      setError(getErrorMessage(err, 'Failed to load products.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { products, loading, error, reload };
}
