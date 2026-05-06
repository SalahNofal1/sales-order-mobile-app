import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { useUi } from '../../context/UiContext';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../services/firebase/config';
import { getUserProfile } from '../../services/userService';

export default function Sidebar() {
  const router = useRouter();
  const { sidebarOpen, closeSidebar } = useUi();
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!user) {
        setRole(null);
        return;
      }
      try {
        const profile = await getUserProfile(user.uid);
        const email = (user.email || '').trim().toLowerCase();
        let fallbackRole: string = 'sales';
        if (email === 'admin@gmail.com' || email === 'admin2@hotmail.com' || email === 'salahnofal602@gmail.com')
          fallbackRole = 'admin';
        else if (email === 'warehouse@gmail.com') fallbackRole = 'warehouse';
        setRole((profile as any)?.role || fallbackRole);
      } catch {
        const email = (user.email || '').trim().toLowerCase();
        if (email === 'admin@gmail.com' || email === 'admin2@hotmail.com' || email === 'salahnofal602@gmail.com')
          setRole('admin');
        else if (email === 'warehouse@gmail.com') setRole('warehouse');
        else setRole('sales');
      }
    };
    run();
  }, [sidebarOpen]);

  if (!sidebarOpen) return null;

  const go = (
    path:
      | '/'
      | '/sales/home'
      | '/warehouse/orders'
      | '/products'
      | '/admin/employees'
      | '/admin/add-employee'
      | '/cart'
      | '/login'
  ) => {
    closeSidebar();
    router.push(path);
  };

  const loggedIn = !!user;
  const normalizedRole = (role || '').toLowerCase();
  const isAdmin = normalizedRole === 'admin';

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={closeSidebar} />
      <View style={styles.panel}>
        <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>
          <Pressable onPress={closeSidebar}>
            <Ionicons name="close" size={22} color={COLORS.textPrimary} />
          </Pressable>
        </View>

        {(loggedIn && (isAdmin || normalizedRole === 'sales')) && (
          <Pressable style={styles.item} onPress={() => go('/sales/home')}>
            <Ionicons name="home-outline" size={18} color={COLORS.primary} />
            <Text style={styles.itemText}>Home</Text>
          </Pressable>
        )}

        {loggedIn && normalizedRole === 'warehouse' && (
          <Pressable style={styles.item} onPress={() => go('/sales/home')}>
            <Ionicons name="home-outline" size={18} color={COLORS.primary} />
            <Text style={styles.itemText}>Home</Text>
          </Pressable>
        )}

        {loggedIn && normalizedRole !== 'warehouse' ? (
          <Pressable style={styles.item} onPress={() => go('/orders')}>
            <Ionicons name="receipt-outline" size={18} color={COLORS.primary} />
            <Text style={styles.itemText}>Orders</Text>
          </Pressable>
        ) : null}

        {(loggedIn && (isAdmin || normalizedRole === 'warehouse')) && (
          <Pressable style={styles.item} onPress={() => go('/products')}>
            <Ionicons name="cube-outline" size={18} color={COLORS.primary} />
            <Text style={styles.itemText}>Products</Text>
          </Pressable>
        )}

        {loggedIn && normalizedRole === 'warehouse' && (
          <Pressable style={styles.item} onPress={() => go('/warehouse/orders')}>
            <Ionicons name="receipt-outline" size={18} color={COLORS.primary} />
            <Text style={styles.itemText}>Orders</Text>
          </Pressable>
        )}

        {loggedIn && (
          <Pressable style={styles.item} onPress={() => go('/cart')}>
            <Ionicons name="cart-outline" size={18} color={COLORS.primary} />
            <Text style={styles.itemText}>Cart</Text>
          </Pressable>
        )}

        {loggedIn && isAdmin && (
          <Pressable style={styles.item} onPress={() => go('/admin/employees')}>
            <Ionicons name="people-outline" size={18} color={COLORS.primary} />
            <Text style={styles.itemText}>Employees</Text>
          </Pressable>
        )}

        <View style={styles.divider} />

        {!loggedIn ? (
          <Pressable style={styles.item} onPress={() => go('/login')}>
            <Ionicons name="log-in-outline" size={18} color={COLORS.primary} />
            <Text style={styles.itemText}>Login</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.item}
            onPress={async () => {
              await auth.signOut();
              closeSidebar();
              router.replace('/login');
            }}
          >
            <Ionicons name="log-out-outline" size={18} color={COLORS.primary} />
            <Text style={styles.itemText}>Logout</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    flexDirection: 'row',
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  panel: {
    width: 280,
    backgroundColor: COLORS.surface,
    borderRightWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  itemText: { fontWeight: '700', color: COLORS.textPrimary },
});

