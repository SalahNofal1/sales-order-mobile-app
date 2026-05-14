import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';
import { COLORS } from '../../constants/colors';
import { getOrderById, type OrderDoc } from '../../services/orderService';

type ItemRow = {
  name: string;
  quantity: number;
  price: number;
};

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDoc | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const o = await getOrderById(String(id));
      setOrder(o);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const items: ItemRow[] = useMemo(() => {
    const list = order?.items || [];
    return list.map((it: any) => ({
      name: String(it?.name ?? ''),
      quantity: Number(it?.quantity ?? 0),
      price: Number(it?.price ?? 0),
    }));
  }, [order?.items]);

  const totalQty = useMemo(() => items.reduce((sum, i) => sum + (i.quantity || 0), 0), [items]);

  return (
    <>
      <Navbar title="تفاصيل الطلب" />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
          </View>
        ) : !order ? (
          <View style={styles.center}>
            <Text style={styles.empty}>الطلب غير موجود</Text>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backBtnText}>رجوع</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.headerCard}>
              <View style={styles.headerTop}>
                <Text style={styles.customerName}>{order.customerName || 'بدون اسم'}</Text>
                <View style={styles.orderBadge}>
                  <Ionicons name="receipt-outline" size={16} color={COLORS.textPrimary} />
                  <Text style={styles.orderBadgeText}>#{order.id.slice(0, 6)}</Text>
                </View>
              </View>

              {order.deliveryTime ? (
                <Text style={styles.meta}>وقت التوصيل: {order.deliveryTime}</Text>
              ) : null}
              <Text style={styles.meta}>الحالة: {order.status}</Text>
              <Text style={styles.meta}>الإجمالي: ${Number(order.total || 0).toFixed(2)}</Text>
              <Text style={styles.meta}>عدد القطع: {totalQty}</Text>
            </View>

            <Text style={styles.sectionTitle}>الأصناف</Text>
            <FlatList
              data={items}
              keyExtractor={(_, idx) => String(idx)}
              contentContainerStyle={{ paddingBottom: 90 }}
              ListEmptyComponent={<Text style={styles.empty}>لا يوجد أصناف</Text>}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.name || 'منتج'}
                    </Text>
                    <Text style={styles.itemMeta}>
                      {item.quantity} × ${Number(item.price || 0).toFixed(2)}
                    </Text>
                  </View>
                  <Text style={styles.itemTotal}>
                    ${Number((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </Text>
                </View>
              )}
            />
          </>
        )}
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { color: COLORS.textSecondary, writingDirection: 'rtl', textAlign: 'center' },

  headerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTop: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  customerName: {
    flex: 1,
    fontWeight: '900',
    color: COLORS.textPrimary,
    fontSize: 18,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  orderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginLeft: 10,
  },
  orderBadgeText: { fontWeight: '900', color: COLORS.textPrimary },
  meta: { marginTop: 6, color: COLORS.textSecondary, writingDirection: 'rtl', textAlign: 'right' },

  sectionTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontWeight: '900',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  itemRow: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  itemName: { fontWeight: '900', color: COLORS.textPrimary, writingDirection: 'rtl', textAlign: 'right' },
  itemMeta: { marginTop: 4, color: COLORS.textSecondary, writingDirection: 'rtl', textAlign: 'right' },
  itemTotal: { fontWeight: '900', color: COLORS.primary },

  backBtn: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  backBtnText: { color: COLORS.surface, fontWeight: '900' },
});

