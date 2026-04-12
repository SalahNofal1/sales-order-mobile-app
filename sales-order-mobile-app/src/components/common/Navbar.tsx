import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const Navbar = ({ title }: { title?: string }) => {
  return (
    <View style={styles.container}>

      <TouchableOpacity>
        <Ionicons name="menu" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightIcons}>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={{ marginLeft: 12 }}>
          <Ionicons name="search-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});