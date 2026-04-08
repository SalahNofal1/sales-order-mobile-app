import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';

import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';
// Firebase
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';

const ManageEmployeeScreen = () => {

  const router = useRouter();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const snapshot = await getDocs(collection(db, 'employees'));

      const list: any[] = [];

      snapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setData(list);
    };

    fetchEmployees();
  }, []);

  return (
    <>
      <Navbar title="Employees" />

      <View style={styles.container}>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
          <TextInput placeholder="Search" style={styles.searchInput} />
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addText}>Add employee</Text>
        </TouchableOpacity>

        <FlatList
          data={data}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }: any) => (
            <View style={styles.card}>

              <View style={styles.avatar} />

              <View style={styles.info}>
                <Text style={styles.name}>
                  {item.fullName || item.name || 'No Name'}
                </Text>
                <Text style={styles.job}>
                  {item.job || 'No job'}
                </Text>
              </View>

              <TouchableOpacity onPress={() => router.push('/edit')}>
                <Ionicons name="create-outline" size={22} color={COLORS.primary} />
              </TouchableOpacity>

            </View>
          )}
        />

      </View>

      <Footer />
    </>
  );
};

export default ManageEmployeeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 15,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    padding: 10,
  },

  addButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
  },

  addText: {
    color: COLORS.surface,
    textAlign: 'center',
    fontWeight: '600',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  avatar: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 25,
  },

  info: {
    flex: 1,
    marginLeft: 10,
  },

  name: {
    fontWeight: '700',
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  job: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});