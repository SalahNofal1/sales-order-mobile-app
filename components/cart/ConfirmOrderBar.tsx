import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

type Props = {
  totalPrice: number;
  onConfirm: () => void;
};

export default function ConfirmOrderBar({ totalPrice, onConfirm }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.label}>Total price</Text>
        <Text style={styles.price}>${totalPrice.toFixed(2)}</Text>
      </View>

      <Pressable style={styles.button} onPress={onConfirm}>
        <Text style={styles.buttonText}>Confirm order</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    paddingHorizontal: 16,

    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  left: {},

  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 4,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});