import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';
import { COLORS } from '../../constants/colors';
import { getProducts, type Product } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const run = async () => {
      try {
        const all = await getProducts();
        const found = all.find((p) => p.id === id) || null;
        setProduct(found);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const imageUrl =
    product?.image && product.image.startsWith('http')
      ? product.image
      : 'https://via.placeholder.com/600x400';

  return (
    <>
      <Navbar title="Product" />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator />
        ) : !product ? (
          <Text style={styles.empty}>Product not found</Text>
        ) : (
          <>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>${Number(product.price || 0).toFixed(2)}</Text>
            <Text style={styles.desc}>{product.description || ''}</Text>

            <Pressable
              style={styles.addBtn}
              onPress={() => {
                addItem(
                  {
                    id: product.id,
                    name: product.name || 'Product',
                    subtitle: product.description || '',
                    price: Number(product.price || 0),
                    image: product.image,
                  },
                  1
                );
                showToast({
                  type: 'success',
                  title: 'Added',
                  message: 'Product added to your order.',
                });
              }}
            >
              <Text style={styles.addBtnText}>Add to Order</Text>
            </Pressable>
          </>
        )}
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  image: { width: '100%', height: 220, borderRadius: 14, backgroundColor: COLORS.accent },
  name: { marginTop: 14, fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  price: { marginTop: 6, fontSize: 16, fontWeight: '700', color: COLORS.primary },
  desc: { marginTop: 10, color: COLORS.textSecondary, lineHeight: 20 },
  empty: { textAlign: 'center', marginTop: 30, color: COLORS.textSecondary },
  addBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addBtnText: { color: COLORS.surface, fontWeight: '900' },
});

