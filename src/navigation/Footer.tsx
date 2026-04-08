import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';

const Footer = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => router.push('/')}>
        <Ionicons name="people-outline" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/products')}>
        <Ionicons name="cube-outline" size={24} color={COLORS.primary} />
      </TouchableOpacity>

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