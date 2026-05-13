import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';
import { getEmployees, type Employee } from '../../services/employeeService';

const ManageEmployeeScreen = () => {
  const router = useRouter();
  const [data, setData] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const list = await getEmployees();
        setData(list);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmployees();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((e) => (e.fullName || e.name || '').toLowerCase().includes(q));
  }, [data, search]);

  return (
    <View style={styles.container}>

      <Navbar title="Employees" />

      <FlatList
        data={filtered}
        keyExtractor={(item: any) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 15, paddingBottom: 100 }}

        ListHeaderComponent={
          <>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
              <TextInput
                placeholder="Search..."
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/admin/add-employee')}>
              <Text style={styles.addText}>+ Add Employee</Text>
            </TouchableOpacity>
          </>
        }

        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: '/admin/employee/[id]',
                params: { id: item.id },
              })
            }
          >

            <View style={styles.avatarFallback}>
              <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>
                {item.fullName || item.name || 'No Name'}
              </Text>

              <Text style={styles.job}>
                {(item as any).role || item.jobType || item.job || 'No job'}
              </Text>
            </View>

            <TouchableOpacity onPress={() => router.push(`/edit?id=${item.id}`)}>
              <Ionicons
                name="create-outline"
                size={22}
                color={COLORS.primary}
              />
            </TouchableOpacity>

          </TouchableOpacity>
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

  avatarFallback: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
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