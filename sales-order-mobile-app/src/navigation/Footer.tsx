import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { COLORS } from '../constants/colors';

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'Employees', icon: 'people-outline', route: '/' },
    { name: 'Products', icon: 'cube-outline', route: '/products' },
    { name: 'Orders', icon: 'cart-outline', route: '/cart' },
    { name: 'Profile', icon: 'person-outline', route: '/profile' },
  ];

  return (
    <View style={styles.container}>

      {tabs.map((tab, index) => {
        const isActive = pathname === tab.route;

        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => router.push(tab.route as any)} // ✅ حل المشكلة
          >

            {/* Active Line */}
            {isActive && <View style={styles.activeLine} />}

            {/* Icon */}
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={isActive ? COLORS.primary : COLORS.textSecondary}
            />

            {/* Text */}
            <Text
              style={[
                styles.label,
                { color: isActive ? COLORS.primary : COLORS.textSecondary },
              ]}
            >
              {tab.name}
            </Text>

            {/* Badge */}
            {tab.name === 'Orders' && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            )}

          </TouchableOpacity>
        );
      })}

    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',
    paddingVertical: 12,

    borderTopWidth: 1,
    borderColor: COLORS.border,

    elevation: 10,
  },

  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    fontSize: 11,
    marginTop: 3,
  },

  activeLine: {
    position: 'absolute',
    top: -10,
    width: 25,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },

  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});