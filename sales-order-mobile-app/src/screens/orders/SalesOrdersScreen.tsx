import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';
import { COLORS } from '../../constants/colors';
import { auth } from '../../services/firebase/config';
import { deleteOrder, getOrdersByUser, type OrderDoc } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import { useRouter } from 'expo-router';

export default function SalesOrdersScreen() {
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const load = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setOrders([]);
      return;
    }
    const list = await getOrdersByUser(user.uid);
    setOrders(list);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  const confirmDelete = async (orderId: string) => {
    const doDelete = async () => {
      try {
        await deleteOrder(orderId);
        showToast({ type: 'success', title: 'Deleted', message: 'Order deleted.' });
        await load();
      } catch (e: any) {
        showToast({ type: 'error', title: 'Error', message: e?.message || 'Failed to delete order.' });
      }
    };

    if (Platform.OS === 'web') {
      const ok = window.confirm('Delete this order?');
      if (ok) await doDelete();
      return;
    }

    Alert.alert('Delete', 'Delete this order?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => doDelete() },
    ]);
  };

  return (
    <>
      <Navbar title="My Orders" />
      <View style={styles.container}>
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
          ListEmptyComponent={<Text style={styles.empty}>No orders yet</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: '/order/[id]',
                  params: { id: item.id },
                })
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>
                  {item.customerName ? item.customerName : 'Customer'}
                </Text>
                <Text style={styles.meta}>طلب رقم: #{item.id.slice(0, 6)}</Text>
                {item.deliveryTime ? (
                  <Text style={styles.meta}>وقت التوصيل: {item.deliveryTime}</Text>
                ) : null}
                <Text style={styles.meta}>الحالة: {item.status}</Text>
                <Text style={styles.meta}>الإجمالي: ${Number(item.total || 0).toFixed(2)}</Text>
              </View>
              <View style={styles.rightCol}>
                <Text style={styles.badge}>{item.items?.length || 0} items</Text>
                <Pressable
                  style={styles.iconBtn}
                  onPress={(e: any) => {
                    e?.stopPropagation?.();
                    confirmDelete(item.id);
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                </Pressable>
              </View>
            </Pressable>
          )}
        />
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  empty: { textAlign: 'center', marginTop: 30, color: COLORS.textSecondary, writingDirection: 'rtl' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  title: { fontWeight: '900', color: COLORS.textPrimary, writingDirection: 'rtl', textAlign: 'right' },
  meta: { marginTop: 4, fontSize: 12, color: COLORS.textSecondary, writingDirection: 'rtl', textAlign: 'right' },
  badge: {
    backgroundColor: COLORS.accent,
    color: COLORS.textPrimary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
    fontWeight: '700',
    fontSize: 12,
  },
  rightCol: { alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
});

