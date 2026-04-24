import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useRouter } from 'expo-router';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { Employee, getEmployees } from '../../services/employeeService';

export default function ManageEmployeeScreen() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const data: Employee[] = await getEmployees();
    setEmployees(data);
    setFilteredEmployees(data);
  };

  const getEmployeeName = (emp: Employee) => {
    return emp.fullName ?? emp.name ?? '';
  };

  useEffect(() => {
    const result = employees.filter((emp) =>
      getEmployeeName(emp)
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredEmployees(result);
  }, [search, employees]);

  const renderItem = ({ item }: { item: Employee }) => (
    <View style={styles.card}>
      <View style={styles.left}>

        <Image
          source={{
            uri:
              item.image ||
              'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          }}
          style={styles.avatar}
        />

        <View>
          <Text style={styles.name}>
            {getEmployeeName(item)}
          </Text>

          <Text style={styles.job}>
            {item.job ?? item.jobType ?? 'No Job'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.push(`/edit/${item.id}`)}
      >
        <Text style={styles.edit}>✏️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      <Navbar
        title="Employees"
        showSearch
        onSearch={setSearch}
      />

      <View style={styles.content}>

        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addText}>+ Add Employee</Text>
        </TouchableOpacity>

        {filteredEmployees.length === 0 ? (
          <Text style={styles.notFound}>Employee not found</Text>
        ) : (
          <FlatList
            data={filteredEmployees}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}

      </View>

      <Footer />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6F8',
  },

  content: {
    flex: 1,
    padding: 15,
    paddingBottom: 100,
  },

  addBtn: {
    backgroundColor: '#F9A8D4',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  addText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },

  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },

  name: {
    fontWeight: '600',
    fontSize: 14,
    color: '#222',
  },

  job: {
    color: '#777',
    fontSize: 12,
  },

  edit: {
    fontSize: 18,
    color: '#F472B6',
  },

  notFound: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 15,
    color: '#999',
  },
});