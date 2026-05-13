import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';
import { COLORS } from '../../constants/colors';
import { getAllOrders, type OrderDoc } from '../../services/orderService';

export default function WarehouseOrdersListScreen() {
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const list = await getAllOrders();
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

  return (
    <>
      <Navbar title="Orders" />
      <View style={styles.container}>
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
          ListEmptyComponent={<Text style={styles.empty}>No orders</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.customerName || 'Customer'}</Text>
                <Text style={styles.meta}>Order: #{item.id.slice(0, 6)}</Text>
                {item.deliveryTime ? <Text style={styles.meta}>Delivery: {item.deliveryTime}</Text> : null}
                <Text style={styles.meta}>Status: {item.status}</Text>
                <Text style={styles.meta}>Total: ${Number(item.total || 0).toFixed(2)}</Text>
              </View>
              <Text style={styles.badge}>{item.items?.length || 0} items</Text>
            </View>
          )}
        />
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  empty: { textAlign: 'center', marginTop: 30, color: COLORS.textSecondary },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: { fontWeight: '900', color: COLORS.textPrimary },
  meta: { marginTop: 4, fontSize: 12, color: COLORS.textSecondary },
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
});

