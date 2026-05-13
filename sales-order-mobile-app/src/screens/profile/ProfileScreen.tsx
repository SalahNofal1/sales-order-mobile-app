import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';
import { COLORS } from '../../constants/colors';
import { getUserProfile } from '../../services/userService';

export default function ProfileScreen() {
  const [role, setRole] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const showMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') window.alert(`${title}\n\n${message}`);
    else Alert.alert(title, message);
  };

  useEffect(() => {
    const run = async () => {
      const user = auth.currentUser;
      if (!user) return;
      setEmail(user.email || '');
      try {
        const profile = await getUserProfile(user.uid);
        setRole(String((profile as any)?.role || 'sales').toLowerCase());
      } catch {
        setRole('sales');
      }
    };
    run();
  }, []);

  return (
    <>
      <Navbar title="Profile" />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email || '-'}</Text>

          <Text style={[styles.label, { marginTop: 14 }]}>Role</Text>
          <Text style={styles.value}>
            {role ? role.charAt(0).toUpperCase() + role.slice(1) : '-'}
          </Text>
        </View>
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: { fontSize: 12, fontWeight: '800', color: COLORS.textSecondary },
  value: { marginTop: 6, fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
});

