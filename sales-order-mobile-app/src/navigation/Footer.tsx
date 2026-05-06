import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/userService';

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        return;
      }

      try {
        const employee = await getUserProfile(user.uid);
        const email = (user.email || '').trim().toLowerCase();

        let fallbackRole: string | null = null;
        if (email === 'admin@gmail.com' || email === 'admin2@hotmail.com') fallbackRole = 'admin';
        else if (email === 'warehouse@gmail.com') fallbackRole = 'warehouse';
        else fallbackRole = 'sales';

        setRole(String((employee as any)?.role || fallbackRole).toLowerCase());
      } catch (error) {
        console.log('Error fetching role:', error);
        const email = (user.email || '').trim().toLowerCase();
        if (email === 'admin@gmail.com' || email === 'admin2@hotmail.com') setRole('admin');
        else if (email === 'warehouse@gmail.com') setRole('warehouse');
        else setRole('sales');
      }
    };

    fetchRole();
  }, [pathname, user?.uid]);

  const isLoggedIn = !!user;
  const normalizedRole = (role || '').toLowerCase();
  const isAdmin = normalizedRole === 'admin';
  const isWarehouse = normalizedRole === 'warehouse';
  const isActive = (route: string) =>
    pathname === route || (route !== '/' && pathname.startsWith(route));

  const Tab = ({
    route,
    icon,
    label,
  }: {
    route:
      | '/'
      | '/sales/home'
      | '/warehouse/orders'
      | '/admin/employees'
      | '/products'
      | '/cart'
      | '/orders'
      | '/login';
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
  }) => {
    const active = isActive(route);
    return (
      <TouchableOpacity
        style={[styles.tab, active && styles.tabActive]}
        onPress={() => router.push(route)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={icon}
          size={22}
          color={active ? COLORS.surface : COLORS.primary}
        />
        <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {(isAdmin || normalizedRole === 'sales') && <Tab route="/sales/home" icon="home-outline" label="Home" />}

      {isWarehouse && <Tab route="/sales/home" icon="home-outline" label="Home" />}

      {isAdmin && (
        <Tab route="/admin/employees" icon="people-outline" label="Emp" />
      )}

      {(isAdmin || isWarehouse) && <Tab route="/products" icon="cube-outline" label="Products" />}

      {(isAdmin || normalizedRole === 'sales') && (
        <Tab route="/cart" icon="cart-outline" label="Cart" />
      )}

      {isLoggedIn && !isWarehouse && <Tab route="/orders" icon="receipt-outline" label="Orders" />}
      {isWarehouse && <Tab route="/warehouse/orders" icon="receipt-outline" label="Orders" />}

      {!isLoggedIn ? <Tab route="/login" icon="log-in-outline" label="Login" /> : null}

    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    minWidth: 70,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  tabLabelActive: {
    color: COLORS.surface,
  },
});
