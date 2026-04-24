import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { COLORS } from '../../constants/colors';
import { getEmployeeById, updateEmployee } from '../../services/employeeService';

const EditEmployeeScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // 🔥 هون الحل

  const [fullName, setFullName] = useState('');
  const [job, setJob] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      console.log('ID:', id); // 🔥 للتأكد

      const emp = await getEmployeeById(id as string);

      if (emp) {
        setFullName(emp.fullName || '');
        setJob(emp.job || emp.jobType || '');
        setPhone(emp.phone || '');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateEmployee(id as string, {
        fullName,
        job,
        phone,
      });

      Alert.alert('Success', 'Updated successfully');
      router.push('/manage-employee'); // 🔥 بدل back
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Navbar title="Edit Employee" />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Edit Details</Text>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              placeholder="Enter name"
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Job</Text>
            <TextInput
              value={job}
              onChangeText={setJob}
              style={styles.input}
              placeholder="Enter job"
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              placeholder="Enter phone"
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Footer />
    </View>
  );
};

export default EditEmployeeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: COLORS.textPrimary,
  },

  inputBox: {
    marginBottom: 15,
  },

  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },

  input: {
    backgroundColor: '#F1F3F7',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3E6ED',
  },

  button: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 14,
  },

  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});