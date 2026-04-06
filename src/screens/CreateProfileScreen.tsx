import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createEmployeeProfile } from '../services/employeeService';
import { COLORS } from '../../constants/colors';

type JobType = 'Sales Representative' | 'Warehouse Keeper';

type DropdownFieldProps = {
  label?: string;
  value: string;
  placeholder: string;
  options: string[];
  onSelect: (value: string) => void;
};

function DropdownField({
  label,
  value,
  placeholder,
  options,
  onSelect,
}: DropdownFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.fieldWrapper}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <Pressable style={styles.dropdown} onPress={() => setVisible(true)}>
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>{label || 'Select an option'}</Text>

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
  const [salesLine, setSalesLine] = useState('');
  const [jobType, setJobType] = useState<JobType>('Sales Representative');

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const [loading, setLoading] = useState(false);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const list: string[] = [];
    for (let year = currentYear; year >= currentYear - 15; year--) {
      list.push(String(year));
    }
    return list;
  }, []);

  const months = useMemo(
    () => ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    []
  );

  const days = useMemo(() => {
    const list: string[] = [];
    for (let day = 1; day <= 31; day++) {
      list.push(String(day).padStart(2, '0'));
    }
    return list;
  }, []);

  const startDate =
    selectedYear && selectedMonth && selectedDay
      ? `${selectedYear}-${selectedMonth}-${selectedDay}`
      : '';

  const showMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setAddress('');
    setEmail('');
    setSalesLine('');
    setJobType('Sales Representative');
    setSelectedYear('');
    setSelectedMonth('');
    setSelectedDay('');
  };

  const validateForm = () => {
    if (!fullName.trim() || !phone.trim() || !address.trim() || !email.trim()) {
      showMessage('Missing Fields', 'Please fill in all required fields.');
      return false;
    }

    if (!startDate) {
      showMessage('Missing Date', 'Please select the start date.');
      return false;
    }

    if (jobType === 'Sales Representative' && !salesLine.trim()) {
      showMessage('Missing Sales Line', 'Please enter the assigned sales line.');
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email.trim())) {
      showMessage('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const handleJobTypeSelect = (value: string) => {
    const selected = value as JobType;
    setJobType(selected);

    if (selected === 'Warehouse Keeper') {
      setSalesLine('');
    }
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      await createEmployeeProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        startDate,
        email: email.trim(),
        salesLine: jobType === 'Sales Representative' ? salesLine.trim() : '',
        jobType,
      });

      showMessage('Success', 'Employee profile created successfully.');
      resetForm();
    } catch (error) {
      console.error(error);
      showMessage('Error', 'Something went wrong while saving the profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Employee Profile</Text>

        <View style={styles.formCard}>
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor="#888"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#888"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              placeholderTextColor="#888"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <Text style={styles.label}>Start Date</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <DropdownField
                value={selectedYear}
                placeholder="Year"
                options={years}
                onSelect={setSelectedYear}
              />
            </View>

            <View style={styles.dateItem}>
              <DropdownField
                value={selectedMonth}
                placeholder="Month"
                options={months}
                onSelect={setSelectedMonth}
              />
            </View>

            <View style={styles.dateItem}>
              <DropdownField
                value={selectedDay}
                placeholder="Day"
                options={days}
                onSelect={setSelectedDay}
              />
            </View>
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <DropdownField
            label="Job Type"
            value={jobType}
            placeholder="Select job type"
            options={['Sales Representative', 'Warehouse Keeper']}
            onSelect={handleJobTypeSelect}
          />

          {jobType === 'Sales Representative' && (
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Sales Line</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter assigned sales line"
                placeholderTextColor="#888"
                value={salesLine}
                onChangeText={setSalesLine}
              />
            </View>
          )}

          <Pressable
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Profile</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  fieldWrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#222',
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
  dropdownText: {
    fontSize: 15,
    color: '#222',
  },
  placeholderText: {
    color: '#888',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  dateItem: {
    flex: 1,
    minWidth: 90,
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  optionText: {
    fontSize: 15,
    color: '#222',
  },
});