import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';

import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';

const ManageEmployeeScreen = () => {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'employees'));

        const list: any[] = [];

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setData(list);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <View style={styles.container}>

      <Navbar title="Employees" />

      <FlatList
        data={data}
        keyExtractor={(item: any) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 15, paddingBottom: 100 }}

        ListHeaderComponent={
          <>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
              <TextInput placeholder="Search..." style={styles.searchInput} />
            </View>

            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addText}>+ Add Employee</Text>
            </TouchableOpacity>
          </>
        }

        renderItem={({ item }: any) => (
          <View style={styles.card}>

            <Image
              source={{
                uri: item.image
                  ? item.image
                  : `https://i.pravatar.cc/150?u=${item.id}`,
              }}
              style={styles.avatar}
            />

            <View style={styles.info}>
              <Text style={styles.name}>
                {item.fullName || item.name || 'No Name'}
              </Text>

              <Text style={styles.job}>
                {item.role || item.jobType || 'No job'}
              </Text>
            </View>

            <TouchableOpacity onPress={() => router.push('/edit')}>
              <Ionicons
                name="create-outline"
                size={22}
                color={COLORS.primary}
              />
            </TouchableOpacity>

          </View>
        )}
      />

      <Footer />

    </View>
  );
};

export default ManageEmployeeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    padding: 10,
  },

  addButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 14,
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
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  info: {
    flex: 1,
    marginLeft: 12,
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