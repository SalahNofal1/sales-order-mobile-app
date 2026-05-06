import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ConfirmOrderBar from '../../components/cart/ConfirmOrderBar';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../constants/colors';
import { useToast } from '../../context/ToastContext';
import { createOrder } from '../../services/orderService';
import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';
import CartProductItem from '../../components/cart/CartProductItem';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { cart, getTotal, clearCart } = useCart();
  const total = getTotal();
  const { showToast } = useToast();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [saving, setSaving] = useState(false);

  const cartItems = useMemo(
    () =>
      cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    [cart]
  );

  const showMessage = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    showToast({ type, title, message });
  };

  const openConfirm = () => {
    if (!user) {
      showMessage('Authentication Required', 'Please sign up or login first.', 'error');
      return;
    }
    if (cart.length === 0) {
      showMessage('Cart Empty', 'There are no products in your cart.', 'info');
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmOrder = async () => {
    if (!user) return;
    if (!customerName.trim()) {
      showMessage('Missing customer name', 'Please enter the customer name.', 'error');
      return;
    }

    try {
      setSaving(true);
      await createOrder({
        userId: user.uid,
        total,
        items: cartItems,
        customerName: customerName.trim(),
        deliveryTime: deliveryTime.trim(),
      });
      clearCart();
      setConfirmOpen(false);
      setCustomerName('');
      setDeliveryTime('');
      showMessage('Success', 'Order confirmed and saved successfully.', 'success');
    } catch (error: any) {
      console.log('Error saving order:', error);
      showMessage('Error', error?.message || 'Failed to save order.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar title="Cart" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {cart.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>Your order is empty</Text>
                <Pressable style={styles.createBtn} onPress={() => router.push('/sales/home')}>
                  <Text style={styles.createBtnText}>Create New Order</Text>
                </Pressable>
              </View>
            ) : (
              cart.map((item) => <CartProductItem key={item.id} product={item} />)
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
      <ConfirmOrderBar totalPrice={total} onConfirm={openConfirm} />
      <Footer />

      <Modal
        visible={confirmOpen}
        transparent
        animationType="fade"
        onRequestClose={() => (saving ? null : setConfirmOpen(false))}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior="padding">
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Confirm order</Text>

              <Text style={styles.label}>Customer name</Text>
              <TextInput
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="e.g. Ahmad Nofal"
                placeholderTextColor={COLORS.textSecondary}
                style={styles.input}
                editable={!saving}
              />

              <Text style={styles.label}>Delivery time</Text>
              <TextInput
                value={deliveryTime}
                onChangeText={setDeliveryTime}
                placeholder="e.g. Today 6pm / 2026-05-06 18:00"
                placeholderTextColor={COLORS.textSecondary}
                style={styles.input}
                editable={!saving}
              />

              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.btn, styles.btnGhost, saving && styles.btnDisabled]}
                  disabled={saving}
                  onPress={() => setConfirmOpen(false)}
                >
                  <Text style={styles.btnGhostText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.btn, styles.btnPrimary, saving && styles.btnDisabled]}
                  disabled={saving}
                  onPress={handleConfirmOrder}
                >
                  <Text style={styles.btnPrimaryText}>{saving ? 'Saving...' : 'Confirm'}</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
  emptyWrap: {
    paddingHorizontal: 16,
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  createBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  createBtnText: {
    color: COLORS.surface,
    fontWeight: '800',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '800', color: COLORS.textSecondary, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: COLORS.textPrimary,
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnPrimaryText: { color: COLORS.surface, fontWeight: '900' },
  btnGhost: { borderWidth: 1, borderColor: COLORS.border },
  btnGhostText: { color: COLORS.textPrimary, fontWeight: '900' },
  btnDisabled: { opacity: 0.65 },
});
