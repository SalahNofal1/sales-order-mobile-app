import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';
import { adminCreateEmployee } from '../../services/adminEmployeeService';

type JobType = 'Sales Representative' | 'Warehouse Keeper';

type DropdownFieldProps = {
  value: string;
  placeholder: string;
  options: string[];
  onSelect: (value: string) => void;
};

function DropdownField({ value, placeholder, options, onSelect }: DropdownFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.fieldWrapper}>
      <Pressable style={styles.dropdown} onPress={() => setVisible(true)}>
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
      </Pressable>
      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((item) => (
                <Pressable
                  key={item}
                  style={styles.optionItem}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function CreateProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [salesLine, setSalesLine] = useState('');
  const [jobType, setJobType] = useState<JobType>('Sales Representative');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [loading, setLoading] = useState(false);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 16 }, (_, i) => String(currentYear - i));
  }, []);
  const months = useMemo(
    () => ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    []
  );
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')), []);

  const startDate =
    selectedYear && selectedMonth && selectedDay
      ? `${selectedYear}-${selectedMonth}-${selectedDay}`
      : '';

  const showMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      return;
    }
    Alert.alert(title, message);
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim() || !phone.trim() || !address.trim() || !email.trim() || !password.trim() || !startDate) {
      showMessage('Missing Fields', 'Please fill all required fields.');
      return;
    }
    if (jobType === 'Sales Representative' && !salesLine.trim()) {
      showMessage('Missing Sales Line', 'Please enter the assigned sales line.');
      return;
    }
    if (password.trim().length < 6) {
      showMessage('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await adminCreateEmployee({
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        startDate,
        email: email.trim(),
        password: password.trim(),
        salesLine: jobType === 'Sales Representative' ? salesLine.trim() : '',
        jobType,
      });
      showMessage('Success', 'Employee profile created successfully.');
      setFullName('');
      setPhone('');
      setAddress('');
      setEmail('');
      setPassword('');
      setSalesLine('');
      setSelectedYear('');
      setSelectedMonth('');
      setSelectedDay('');
    } catch {
      showMessage('Error', 'Something went wrong while saving the profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar title="Add Employee" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
            <Text style={styles.label}>Address</Text>
            <TextInput style={styles.input} value={address} onChangeText={setAddress} />
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry
            />
            <Text style={styles.label}>Start Date</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateItem}>
                <DropdownField value={selectedYear} placeholder="Year" options={years} onSelect={setSelectedYear} />
              </View>
              <View style={styles.dateItem}>
                <DropdownField value={selectedMonth} placeholder="Month" options={months} onSelect={setSelectedMonth} />
              </View>
              <View style={styles.dateItem}>
                <DropdownField value={selectedDay} placeholder="Day" options={days} onSelect={setSelectedDay} />
              </View>
            </View>
            <Text style={styles.label}>Job Type</Text>
            <DropdownField
              value={jobType}
              placeholder="Select job type"
              options={['Sales Representative', 'Warehouse Keeper']}
              onSelect={(value) => setJobType(value as JobType)}
            />
            {jobType === 'Sales Representative' && (
              <>
                <Text style={styles.label}>Sales Line</Text>
                <TextInput style={styles.input} value={salesLine} onChangeText={setSalesLine} />
              </>
            )}
            <Pressable style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={handleSaveProfile} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save Employee</Text>}
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 30 },
  formCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16 },
  fieldWrapper: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#222',
    marginBottom: 12,
  },
  dropdown: {
    minHeight: 50,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: { fontSize: 15, color: '#222' },
  placeholderText: { color: '#888' },
  dateRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  dateItem: { flex: 1, minWidth: 90 },
  saveButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 12, maxHeight: '70%' },
  optionItem: { paddingVertical: 14, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#eee' },
  optionText: { fontSize: 15, color: '#222' },
});
