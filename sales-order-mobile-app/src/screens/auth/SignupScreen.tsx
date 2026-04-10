import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { signup } from '../../services/authService';
import { createUserProfile } from '../../services/userService';
import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [jobType, setJobType] = useState('');
  const [password, setPassword] = useState('');

  const showMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      return;
    }
    Alert.alert(title, message);
  };

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      showMessage('Error', 'Please fill all required fields');
      return;
    }

    try {
      const user = await signup(email, password);
      let role = 'sales';
      if (email === 'admin@gmail.com') role = 'admin';
      if (email === 'warehouse@gmail.com') role = 'warehouse';

      await createUserProfile(user.uid, {
        fullName,
        email,
        phone,
        address,
        jobType,
        role,
        salesLine: '',
        startDate: new Date().toISOString().split('T')[0],
      });

      showMessage('Success', 'Account created successfully');
      setFullName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setJobType('');
      setPassword('');
    } catch (error: any) {
      showMessage('Error', error.message ?? 'Failed to sign up');
    }
  };

  return (
    <>
      <Navbar title="Sign Up" />
      <View style={styles.container}>
        <TextInput placeholder="Full Name" style={styles.input} value={fullName} onChangeText={setFullName} />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput placeholder="Phone" style={styles.input} value={phone} onChangeText={setPhone} />
        <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />
        <TextInput placeholder="Job Type" style={styles.input} value={jobType} onChangeText={setJobType} />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
