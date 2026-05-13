import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import type { Product } from '../../services/productService';

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const imageUrl =
    product.image && product.image.startsWith('http')
      ? product.image
      : 'https://via.placeholder.com/300x300';

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/sales/product/[id]',
          params: { id: product.id },
        })
      }
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Pressable
          style={styles.quickAddBtn}
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
            showToast({ type: 'success', title: 'Added', message: 'Added to your order.' });
          }}
          hitSlop={10}
        >
          <Ionicons name="add" size={18} color={COLORS.surface} />
        </Pressable>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name || 'Product'}
        </Text>
        <Text style={styles.price}>${Number(product.price || 0).toFixed(2)}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {product.description || ''}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 120, backgroundColor: COLORS.accent },
  quickAddBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  body: { padding: 10 },
  name: { fontWeight: '700', color: COLORS.textPrimary },
  price: { marginTop: 4, fontWeight: '700', color: COLORS.primary },
  desc: { marginTop: 6, fontSize: 12, color: COLORS.textSecondary },
});

