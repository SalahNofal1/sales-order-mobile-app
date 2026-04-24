import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import Footer from '../../src/components/Footer';
import Navbar from '../../src/components/Navbar';

import { getProducts, updateProduct } from '../../src/services/productService';

export default function EditProduct() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const products = await getProducts();
      const found = products.find((p: any) => p.id === id);

      if (found) {
        setName(found.name || '');
        setPrice(String(found.price || ''));
        setDesc(found.description || '');
        setImage(found.image || '');
      }
    } catch (e) {
      Alert.alert('Error loading product');
    }
  };

  const handleUpdate = async () => {
    if (!name || !price) {
      Alert.alert('Please fill all fields');
      return;
    }

    try {
      await updateProduct(id as string, {
        name,
        price: Number(price),
        description: desc,
        image,
      });

      Alert.alert('Updated Successfully');
      router.push('/manage-products');
    } catch (e) {
      Alert.alert('Error updating product');
    }
  };

  return (
    <View style={styles.container}>
      <Navbar title="Edit Product" />

      <View style={styles.content}>
        <TextInput
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          keyboardType="numeric"
        />

        <TextInput
          placeholder="Description"
          value={desc}
          onChangeText={setDesc}
          style={styles.input}
        />

        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : null}

        <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
          <Text style={styles.btnText}>Update Product</Text>
        </TouchableOpacity>
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  content: {
    padding: 20,
    flex: 1,
  },

  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 15,
  },

  btn: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
});