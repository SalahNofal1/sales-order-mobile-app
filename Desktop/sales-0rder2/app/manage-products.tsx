import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useRouter } from 'expo-router';

import Footer from '../src/components/Footer';
import Navbar from '../src/components/Navbar';

import {
    deleteProduct,
    getProducts,
} from '../src/services/productService';

type Product = {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  image?: string;
  quantity?: number;
};

export default function ManageProductsScreen() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data as Product[]);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await deleteProduct(id);
            fetchProducts();
          } catch (e) {
            Alert.alert('Error deleting product');
          }
        },
      },
    ]);
  };

  const filteredProducts = products.filter((item) => {
    const name = item.name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const renderItem = ({ item }: { item: Product }) => {
    const imageUrl =
      item.image && item.image.startsWith('http')
        ? item.image
        : 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

    return (
      <View style={styles.card}>
        <View style={styles.left}>
          <Image source={{ uri: imageUrl }} style={styles.image} />

          <View>
            <Text style={styles.name}>{item.name || 'No Name'}</Text>
            <Text style={styles.price}>${item.price || 0}</Text>
            <Text style={styles.qty}>
              Qty: {item.quantity ?? 0}
            </Text>
            <Text style={styles.desc}>
              {item.description || 'No Description'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => router.push(`/edit-product/${item.id}`)}
          >
            <Text style={styles.edit}>✏️</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.delete}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar title="Products" />

      <View style={styles.content}>
        <TextInput
          placeholder="Search product..."
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/add-product')}
        >
          <Text style={styles.addText}>+ Add Product</Text>
        </TouchableOpacity>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6FA',
  },

  content: {
    flex: 1,
    padding: 15,
  },

  search: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFD6E8',
  },

  addBtn: {
    backgroundColor: '#FF8FB1',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  addText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD6E8',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },

  name: {
    fontWeight: 'bold',
  },

  price: {
    color: '#FF4FA3',
  },

  qty: {
    color: 'green',
    fontWeight: 'bold',
  },

  desc: {
    color: '#777',
    fontSize: 12,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
  },

  edit: {
    fontSize: 18,
    color: '#FF8FB1',
  },

  delete: {
    fontSize: 18,
    color: 'red',
  },
});