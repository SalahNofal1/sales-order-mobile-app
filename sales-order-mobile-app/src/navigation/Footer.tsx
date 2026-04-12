import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { auth } from '../services/firebase/config';
import { getUserProfile } from '../services/userService';

const Footer = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (auth.currentUser) {
        try {
          const employee = await getUserProfile(auth.currentUser.uid);
          setRole(employee.role);
        } catch (error) {
          console.log("Error fetching role:", error);
        }
      }
    };

    fetchRole();
  }, []);

  const isAdmin = role === "admin";

  return (
    <View style={styles.container}>

      {}
      {(isAdmin || role === "admin") && (
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="people-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      )}

      {}
      {(isAdmin || role === "warehouse") && (
        <TouchableOpacity onPress={() => router.push('/products')}>
          <Ionicons name="cube-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      )}

      {}
      {(isAdmin || role === "sales") && (
        <TouchableOpacity onPress={() => router.push('/cart')}>
          <Ionicons name="cart-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      )}

      {}
      <TouchableOpacity onPress={() => router.push('/profile')}>
        <Ionicons name="person-outline" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      {}
      {!role && (
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Ionicons name="log-in-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      )}

    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
});
