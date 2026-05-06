import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useUi } from '../../context/UiContext';

const Navbar = ({ title }: { title?: string }) => {
  const { toggleSidebar } = useUi();
  return (
    <View style={styles.container}>

      <View style={styles.leftSlot}>
        <TouchableOpacity onPress={toggleSidebar} hitSlop={10}>
          <Ionicons name="menu" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightSlot} />

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
    position: 'relative',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    pointerEvents: 'none',
  },

  leftSlot: {
    width: 56,
    alignItems: 'flex-start',
  },
  rightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 90,
    justifyContent: 'flex-end',
  },
});