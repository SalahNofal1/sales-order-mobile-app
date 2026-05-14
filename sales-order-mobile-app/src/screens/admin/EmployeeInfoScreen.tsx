import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';
import { COLORS } from '../../constants/colors';
import { deleteEmployee, getEmployeeById, type Employee } from '../../services/employeeService';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../services/userService';
import { adminSetPasswordByEmail } from '../../services/functions/adminPasswordService';

export default function EmployeeInfoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const showMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') window.alert(`${title}\n\n${message}`);
    else Alert.alert(title, message);
  };

  useEffect(() => {
    const run = async () => {
      const data = await getEmployeeById(id);
      setEmployee(data);
    };
    run();
  }, [id]);

  useEffect(() => {
    const run = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const email = (user.email || '').trim().toLowerCase();
      if (email === 'admin@gmail.com' || email === 'admin2@hotmail.com' || email === 'salahnofal602@gmail.com') {
        setIsAdmin(true);
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);
        setIsAdmin(String((profile as any)?.role || '').toLowerCase() === 'admin');
      } catch {
        setIsAdmin(false);
      }
    };
    run();
  }, [user?.uid]);

  const handleSetPassword = async () => {
    const targetEmail = employee?.email?.trim();
    if (!targetEmail) {
      showMessage('Error', 'Employee email is missing.');
      return;
    }
    if (newPassword.trim().length < 6) {
      showMessage('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    try {
      await adminSetPasswordByEmail(targetEmail, newPassword.trim());
      setNewPassword('');
      showMessage('Success', 'Password updated.');
    } catch (e: any) {
      showMessage('Error', e?.message || 'Failed to update password.');
    }
  };

  const handleDelete = async () => {
    const doDelete = async () => {
      try {
        await deleteEmployee(id);
        showMessage('Success', 'Employee deleted.');
        router.replace('/admin/employees');
      } catch (e: any) {
        showMessage('Error', e?.message || 'Failed to delete employee.');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Delete this employee?')) await doDelete();
      return;
    }
    Alert.alert('Delete', 'Delete this employee?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => doDelete() },
    ]);
  };

  return (
    <>
      <Navbar title="Employee Info" />
      <View style={styles.container}>
        {!employee ? (
          <Text style={styles.empty}>Employee not found</Text>
        ) : (
          <View style={styles.card}>
            <Text style={styles.name}>{employee.fullName || employee.name || 'Employee'}</Text>
            <Text style={styles.row}>Email: {employee.email || '-'}</Text>
            <Text style={styles.row}>Phone: {employee.phone || '-'}</Text>
            <Text style={styles.row}>Address: {employee.address || '-'}</Text>
            <Text style={styles.row}>Job: {employee.jobType || employee.job || '-'}</Text>

            {isAdmin && (
              <View style={styles.passwordBox}>
                <Text style={styles.passwordLabel}>Set Password</Text>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New password"
                  autoCapitalize="none"
                  secureTextEntry
                />
                <View style={styles.passwordActions}>
                  <Pressable style={styles.setPasswordBtn} onPress={handleSetPassword}>
                    <Text style={styles.btnText}>Save Password</Text>
                  </Pressable>
                </View>
              </View>
            )}

            <View style={styles.actions}>
              <Pressable style={styles.editBtn} onPress={() => router.push(`/edit?id=${id}`)}>
                <Text style={styles.btnText}>Edit</Text>
              </Pressable>
              <Pressable style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.btnText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  empty: { textAlign: 'center', marginTop: 30, color: COLORS.textSecondary },
  card: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  name: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 10 },
  row: { marginTop: 6, color: COLORS.textSecondary },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  editBtn: { flex: 1, backgroundColor: COLORS.primary, padding: 12, borderRadius: 12, alignItems: 'center' },
  deleteBtn: { flex: 1, backgroundColor: COLORS.error, padding: 12, borderRadius: 12, alignItems: 'center' },
  btnText: { color: COLORS.surface, fontWeight: '800' },
  passwordBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  passwordLabel: { fontWeight: '900', color: COLORS.textPrimary, marginBottom: 8 },
  passwordInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  passwordActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  setPasswordBtn: { flex: 1, backgroundColor: COLORS.primary, padding: 12, borderRadius: 12, alignItems: 'center' },
});

