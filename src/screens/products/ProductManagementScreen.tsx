import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';

const ProductManagementScreen = () => {

  const data = [
    {
      id: '1',
      name: 'Perfume',
      price: '$20',
      description: 'Nice smell perfume',
      image: 'https://via.placeholder.com/80',
    },
    {
      id: '2',
      name: 'Lipstick',
      price: '$15',
      description: 'Pink lipstick',
      image: 'https://via.placeholder.com/80',
    },
    {
      id: '3',
      name: 'Bag',
      price: '$50',
      description: 'Leather bag',
      image: 'https://via.placeholder.com/80',
    },
  ];

  return (
    <>
      <Navbar title="Products" />

      <View style={styles.container}>

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addText}>+ Add Product</Text>
        </TouchableOpacity>

        {/* List */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>

              <Image source={{ uri: item.image }} style={styles.image} />

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.desc}>{item.description}</Text>
              </View>

              <View style={styles.actions}>
                <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              </View>

            </View>
          )}
        />

      </View>

      <Footer />
    </>
  );
};

export default ProductManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 15,
  },

  addButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
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
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  info: {
    flex: 1,
    marginLeft: 10,
  },

  name: {
    fontWeight: '700',
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  price: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  desc: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  actions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
});