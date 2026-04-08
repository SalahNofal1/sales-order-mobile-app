import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { getEmployees, deleteEmployee } from '../services/employeeService';

export default function AdminManagementScreen() {
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data);
  };

  const confirmDelete = async (id: string, name: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);
      if (confirmed) {
        await deleteEmployee(id);
        loadEmployees();
      }
      return;
    }

    Alert.alert(
      'Delete Employee',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteEmployee(id);
            loadEmployees();
          },
        },
      ]
    );
  };

  const handleEdit = (employee: any) => {
    if (Platform.OS === 'web') {
      window.alert(`Edit for ${employee.fullName} will be connected after merge.`);
      return;
    }

    Alert.alert(
      'Edit Employee',
      `Edit for ${employee.fullName} will be connected after merge.`
    );
  };

  const handleAddEmployee = () => {
    if (Platform.OS === 'web') {
      window.alert('Add New Employee will be connected after merge.');
      return;
    }

    Alert.alert(
      'Add New Employee',
      'This button will be connected after merge.'
    );
  };

  const formatRole = (role: string) => {
    if (role === 'sales') return 'Sales';
    if (role === 'warehouse') return 'Warehouse';
    return role || 'Employee';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>Admin Management</Text>
          <Text style={styles.subtitle}>
            Manage employees, review details, and control actions
          </Text>
          <Text style={styles.count}>Total Employees: {employees.length}</Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddEmployee}>
          <Text style={styles.addButtonText}>+ Add New Employee</Text>
        </TouchableOpacity>

        {employees.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No employees found</Text>
            <Text style={styles.emptyText}>
              Employees will appear here after adding them
            </Text>
          </View>
        ) : (
          employees.map((emp) => (
            <View key={emp.id} style={styles.card}>
              <View style={styles.headerRow}>
                <View style={styles.employeeMainInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {emp.fullName?.charAt(0)?.toUpperCase() || 'E'}
                    </Text>
                  </View>

                  <View style={styles.nameSection}>
                    <Text style={styles.name}>{emp.fullName}</Text>
                    <Text style={styles.smallText}>{emp.email}</Text>
                  </View>
                </View>

                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>
                    {formatRole(emp.jobType)}
                  </Text>
                </View>
              </View>

              <View style={styles.infoBox}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{emp.phone || '-'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{emp.address || '-'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Start Date</Text>
                  <Text style={styles.infoValue}>{emp.startDate || '-'}</Text>
                </View>

                {emp.salesLine ? (
                  <View style={styles.infoRowLast}>
                    <Text style={styles.infoLabel}>Sales Line</Text>
                    <Text style={styles.infoValue}>{emp.salesLine}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEdit(emp)}
                >
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => confirmDelete(emp.id, emp.fullName)}
                >
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 55 : 65,
    paddingBottom: 30,
  },
  headerSection: {
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  count: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  addButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F2D7E2',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  employeeMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 16,
  },
  nameSection: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  smallText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  roleBadge: {
    backgroundColor: COLORS.accent,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  roleBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: '#FFEAF3',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  infoRow: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  infoRowLast: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#0B2A6B',
  },
  deleteButton: {
    backgroundColor: '#E53935',
  },
  actionButtonText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 15,
  },
});