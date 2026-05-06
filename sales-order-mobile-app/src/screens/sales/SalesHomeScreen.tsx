import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';
import { COLORS } from '../../constants/colors';
import { getProducts, type Product } from '../../services/productService';
import ProductCard from '../../components/products/ProductCard';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'expo-router';

export default function SalesHomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { cart } = useCart();
  const router = useRouter();
  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);

  const load = useCallback(async () => {
    const list = await getProducts();
    setProducts(list);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => (p.name || '').toLowerCase().includes(q));
  }, [products, search]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <Navbar title="Home" />
      <View style={styles.container}>
        {cartCount > 0 ? (
          <Pressable style={styles.cartBar} onPress={() => router.push('/cart')}>
            <View style={styles.cartBarLeft}>
              <Ionicons name="cart-outline" size={18} color={COLORS.surface} />
              <Text style={styles.cartBarText}>
                {cartCount} item{cartCount === 1 ? '' : 's'} in your order
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.surface} />
          </Pressable>
        ) : null}

        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
          <TextInput
            placeholder="Search products..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => <ProductCard product={item} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products found</Text>
          }
        />
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 12 },
  cartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  cartBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cartBarText: { color: COLORS.surface, fontWeight: '900' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: { flex: 1, padding: 10 },
  row: { gap: 10 },
  emptyText: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 20 },
});

