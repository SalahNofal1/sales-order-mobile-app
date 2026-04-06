import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import ConfirmOrderBar from '../../components/cart/ConfirmOrderBar';
import CartProductItem from '../../components/cart/CartProductItem';
import { useCart } from '../context/CartContext';
import { COLORS } from '../../constants/colors';
import { createOrder } from '../services/orderService';

export default function CartScreen() {
  const { cart, getTotal, clearCart } = useCart();
  const total = getTotal();

  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      if (Platform.OS === 'web') {
        window.alert('There are no products in your cart.');
      } else {
        Alert.alert('Cart Empty', 'There are no products in your cart.');
      }
      return;
    }

    const message = `Are you sure?\nTotal: $${total.toFixed(2)}`;

    const saveOrder = async () => {
      try {
        await createOrder({
          userId: 'user_1',
          total,
          items: cart.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        });

        clearCart();

        if (Platform.OS === 'web') {
          window.alert('Order confirmed and saved successfully.');
        } else {
          Alert.alert('Success', 'Order confirmed and saved successfully.');
        }
      } catch (error) {
        console.log('Error saving order:', error);

        if (Platform.OS === 'web') {
          window.alert('Failed to save order.');
        } else {
          Alert.alert('Error', 'Failed to save order.');
        }
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(message);
      if (confirmed) {
        await saveOrder();
      }
    } else {
      Alert.alert('Confirm Order', message, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            saveOrder();
          },
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {cart.length === 0 ? (
            <Text style={styles.emptyText}>Your cart is empty</Text>
          ) : (
            cart.map((item) => (
              <CartProductItem key={item.id} product={item} />
            ))
          )}
        </ScrollView>
      </View>

      <ConfirmOrderBar totalPrice={total} onConfirm={handleConfirmOrder} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
    color: COLORS.textSecondary,
  },
});