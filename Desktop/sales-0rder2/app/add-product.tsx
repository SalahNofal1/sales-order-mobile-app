import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useRouter } from 'expo-router';
import Footer from '../src/components/Footer';
import Navbar from '../src/components/Navbar';

import { createProduct } from '../src/services/productService';

export default function AddProduct() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAdd = async () => {
    if (!name || !price || !quantity) {
      Alert.alert('Fill all fields');
      return;
    }

    try {
      await createProduct({
        name,
        price: Number(price),
        description: desc,
        image: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        quantity: Number(quantity),
      });

      Alert.alert('Added successfully');
      router.replace('/manage-products');
    } catch (e) {
      Alert.alert('Error adding product');
    }
  };

  return (
    <View style={styles.container}>
      <Navbar title="Add Product" />

      <View style={styles.content}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Description"
          value={desc}
          onChangeText={setDesc}
          style={styles.input}
        />

        <TextInput
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity style={styles.btn} onPress={handleAdd}>
          <Text style={styles.btnText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF6FA' },
  content: { padding: 15 },

  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFD6E8',
  },

  btn: {
    backgroundColor: '#FF8FB1',
    padding: 15,
    borderRadius: 12,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});