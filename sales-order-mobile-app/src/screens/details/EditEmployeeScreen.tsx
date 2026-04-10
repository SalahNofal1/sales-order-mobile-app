import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';
import {
  deleteEmployee,
  getEmployeeById,
  updateEmployee,
} from '../../services/employeeService';

const EditEmployeeScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [job, setJob] = useState('');
  const [loading, setLoading] = useState(false);

  const showMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      return;
    }
    Alert.alert(title, message);
  };

  useEffect(() => {
    const loadEmployee = async () => {
      if (!id) return;
      try {
        const employee = await getEmployeeById(id);
        if (!employee) return;
        setName(employee.fullName || employee.name || '');
        setEmail(employee.email || '');
        setPhone(employee.phone || '');
        setAddress(employee.address || '');
        setJob(employee.jobType || employee.job || '');
      } catch (error: any) {
        showMessage('Error', error?.message || 'Failed to load employee.');
      }
    };
    loadEmployee();
  }, [id]);

  const handleSave = async () => {
    if (!id) {
      showMessage('Error', 'Employee id is missing.');
      return;
    }
    try {
      setLoading(true);
      await updateEmployee(id, {
        fullName: name,
        email,
        phone,
        address,
        jobType: job,
      });
      showMessage('Success', 'Employee updated successfully.');
      router.replace('/');
    } catch (error: any) {
      showMessage('Error', error?.message || 'Failed to update employee.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      showMessage('Error', 'Employee id is missing.');
      return;
    }
    try {
      setLoading(true);
      await deleteEmployee(id);
      showMessage('Success', 'Employee deleted successfully.');
      router.replace('/');
    } catch (error: any) {
      showMessage('Error', error?.message || 'Failed to delete employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar title="Edit Employee" />

      <View style={styles.container}>

        <Text style={styles.title}>Edit employee Details</Text>

        {/* Username */}
        <View style={styles.inputBox}>
          <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
          <TextInput
            placeholder="Enter the username"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Email */}
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
          <TextInput
            placeholder="Enter the email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Phone */}
        <View style={styles.inputBox}>
          <Ionicons name="call-outline" size={20} color={COLORS.textSecondary} />
          <TextInput
            placeholder="Enter the phone number"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Address */}
        <View style={styles.inputBox}>
          <Ionicons name="location-outline" size={20} color={COLORS.textSecondary} />
          <TextInput
            placeholder="Enter the address"
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Job */}
        <View style={styles.inputBox}>
          <Ionicons name="briefcase-outline" size={20} color={COLORS.textSecondary} />
          <TextInput
            placeholder="Enter the job"
            style={styles.input}
            value={job}
            onChangeText={setJob}
          />
        </View>

        {/* Upload */}
        <TouchableOpacity style={styles.upload}>
          <Text style={styles.uploadText}>Add a photo</Text>
          <Ionicons name="cloud-upload-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Buttons */}
        <View style={styles.buttons}>

          <TouchableOpacity style={styles.save} onPress={handleSave} disabled={loading}>
            <Text style={styles.saveText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.delete} onPress={handleDelete} disabled={loading}>
            <Text style={styles.deleteText}>{loading ? 'Deleting...' : 'Delete'}</Text>
          </TouchableOpacity>

        </View>

      </View>

      <Footer />
    </>
  );
};

export default EditEmployeeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  input: {
    marginLeft: 10,
    flex: 1,
  },

  upload: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.accent,
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },

  uploadText: {
    color: COLORS.textPrimary,
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  save: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
  },

  saveText: {
    color: COLORS.surface,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  delete: {
    backgroundColor: COLORS.error,
    padding: 15,
    borderRadius: 12,
    flex: 1,
  },

  deleteText: {
    color: COLORS.surface,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});