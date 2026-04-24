import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useRouter } from 'expo-router';

import Footer from '../src/components/Footer';
import Navbar from '../src/components/Navbar';

import {
    deleteProduct,
    getProducts,
    updateProduct,
} from '../src/services/productService';

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  quantity?: number;
};

export default function ManageProductsScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data as Product[]);
  };

  const handleDelete = (id: string) => {
    console.log('DELETE CLICKED');

    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
          } catch (e) {
            Alert.alert('Error deleting');
          }
        },
      },
    ]);
  };

  const increaseQty = async (item: Product) => {
    await updateProduct(item.id, {
      quantity: (item.quantity || 0) + 1,
    });
    fetchProducts();
  };

  const decreaseQty = async (item: Product) => {
    if ((item.quantity || 0) <= 0) return;

    await updateProduct(item.id, {
      quantity: (item.quantity || 0) - 1,
    });
    fetchProducts();
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>

      <View style={styles.left}>
        <Image
          source={{
            uri:
              item.image ||
              'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          }}
          style={styles.image}
        />

        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price}</Text>

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
          style={styles.actionBtn}
          onPress={() => increaseQty(item)}
        >
          <Text style={styles.plus}>➕</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => decreaseQty(item)}
        >
          <Text style={styles.minus}>➖</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/edit-product/${item.id}`)}
        >
          <Text style={styles.edit}>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.delete}>🗑️</Text>
        </TouchableOpacity>

      </View>

    </View>
  );

  return (
    <View style={styles.container}>

      <Navbar title="Products" />

      <View style={styles.content}>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/add-product')}
        >
          <Text style={styles.addText}>+ Add Product</Text>
        </TouchableOpacity>

        <FlatList
          data={products}
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
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },

  name: {
    fontWeight: 'bold',
  },

  price: {
    color: '#FF4FA3',
  },

  qty: {
    color: 'green',
    fontSize: 12,
    fontWeight: 'bold',
  },

  desc: {
    color: '#777',
    fontSize: 12,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionBtn: {
    padding: 10,
    marginHorizontal: 3,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },

  plus: {
    fontSize: 18,
  },

  minus: {
    fontSize: 18,
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