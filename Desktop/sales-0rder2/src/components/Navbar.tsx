import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type Props = {
  title: string;
  showSearch?: boolean;
  onSearch?: (text: string) => void;
};

export default function Navbar({ title, showSearch, onSearch }: Props) {
  return (
    <View style={styles.container}>

      <View style={styles.topRow}>

        <TouchableOpacity style={styles.icon}>
          <Ionicons name="menu-outline" size={22} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.icon}>
            <Ionicons name="notifications-outline" size={20} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.icon}>
            <Ionicons name="person-circle-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>

      </View>

      {showSearch && (
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#777" />
          <TextInput
            placeholder="Search employee..."
            placeholderTextColor="#999"
            style={styles.input}
            onChangeText={onSearch}
          />
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 55,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },

  rightIcons: {
    flexDirection: 'row',
    gap: 10,
  },

  icon: {
    backgroundColor: '#FDECEF',
    padding: 8,
    borderRadius: 10,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEF',
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  input: {
    flex: 1,
    padding: 10,
  },
});