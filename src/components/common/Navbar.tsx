import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';

const Navbar = ({ title }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },

  title: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});