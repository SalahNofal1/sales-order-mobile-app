import React from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ConfirmOrderBar from '../../components/cart/ConfirmOrderBar';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../constants/colors';
import { createOrder } from '../../services/orderService';
import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';
import CartProductItem from '../../components/cart/CartProductItem';

export default function CartScreen() {
  const { user } = useAuth();
  const { cart, getTotal, clearCart } = useCart();
  const total = getTotal();

  const showMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      return;
    }
    Alert.alert(title, message);
  };

  const handleConfirmOrder = async () => {
    if (!user) {
      showMessage('Authentication Required', 'Please sign up or login first.');
      return;
    }
    if (cart.length === 0) {
      showMessage('Cart Empty', 'There are no products in your cart.');
      return;
    }

    try {
      await createOrder({
        userId: user.uid,
        total,
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });
      clearCart();
      showMessage('Success', 'Order confirmed and saved successfully.');
    } catch (error) {
      console.log('Error saving order:', error);
      showMessage('Error', 'Failed to save order.');
    }
  };

  return (
    <>
      <Navbar title="Cart" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {cart.length === 0 ? (
              <Text style={styles.emptyText}>Your cart is empty</Text>
            ) : (
              cart.map((item) => <CartProductItem key={item.id} product={item} />)
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
      <ConfirmOrderBar totalPrice={total} onConfirm={handleConfirmOrder} />
      <Footer />
    </>
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
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
    color: COLORS.textSecondary,
  },
});
