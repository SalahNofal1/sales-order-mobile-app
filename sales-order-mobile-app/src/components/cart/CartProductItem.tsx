import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { CartItem } from '../../context/CartContext';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../constants/colors';

type Props = {
  product: CartItem;
};

const placeholderImage = { uri: 'https://via.placeholder.com/90x78' };

export default function CartProductItem({ product }: Props) {
  const { increaseQty, decreaseQty, removeItem } = useCart();
  const imageSource = product.image ? { uri: product.image } : placeholderImage;

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.rowTop}>
            <View style={styles.textBlock}>
              <Text style={styles.title}>{product.name}</Text>
              <Text style={styles.subtitle}>{product.subtitle}</Text>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            </View>

            <Pressable onPress={() => removeItem(product.id)} style={styles.closeButton}>
              <Text style={styles.close}>x</Text>
            </Pressable>
          </View>

          <View style={styles.bottom}>
            <View style={styles.qtyContainer}>
              <Pressable style={styles.qtyBtn} onPress={() => increaseQty(product.id)}>
                <Text style={styles.qtySymbol}>+</Text>
              </Pressable>
              <Text style={styles.qtyNumber}>{product.quantity}</Text>
              <Pressable style={styles.qtyBtn} onPress={() => decreaseQty(product.id)}>
                <Text style={styles.qtySymbol}>-</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: 90,
    height: 78,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: COLORS.surface,
  },
  info: {
    flex: 1,
  },
  textBlock: {
    flexShrink: 1,
    paddingRight: 10,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 5,
  },
  closeButton: {
    paddingLeft: 8,
    paddingRight: 2,
  },
  close: {
    fontSize: 22,
    color: COLORS.error,
    fontWeight: '600',
  },
  bottom: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtySymbol: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qtyNumber: {
    marginHorizontal: 10,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    minWidth: 16,
    textAlign: 'center',
  },
});
