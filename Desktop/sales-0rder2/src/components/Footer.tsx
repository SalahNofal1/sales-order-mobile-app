import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>© 2026 Sales Order App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});