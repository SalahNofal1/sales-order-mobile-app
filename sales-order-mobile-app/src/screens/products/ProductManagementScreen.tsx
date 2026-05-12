import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

import Navbar from '../../components/common/Navbar';
import Footer from '../../navigation/Footer';
import { useToast } from '../../context/ToastContext';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useProducts } from '../../hooks/useProducts';
import { createProduct, deleteProduct, type Product, updateProduct } from '../../services/productService';
import { getErrorMessage } from '../../utils/errorMessage';

const ProductManagementScreen = () => {
  const { products: data, loading: productsLoading, error: productsError, reload: loadProducts } = useProducts();
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const nameInputRef = useRef<TextInput>(null);

  const { showToast } = useToast();

  const showMessage = useCallback(
    (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
      if (Platform.OS === 'web' && type === 'error') {
        window.alert(`${title}\n\n${message}`);
        return;
      }
      showToast({ type, title, message });
    },
    [showToast]
  );

  const { imageUri, setImageUri, requestAddProductImage } = useImagePicker(showMessage);

  useEffect(() => {
    if (!modalVisible) return;
    const t = setTimeout(() => nameInputRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, [modalVisible]);

  const handleCreateProduct = async () => {
    if (!name.trim() || !price.trim()) {
      showMessage('Missing Fields', 'Please enter product name and price.', 'error');
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
      showMessage('Invalid Price', 'Price must be a valid number.', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingProductId) {
        await updateProduct(editingProductId, {
          name: name.trim(),
          price: numericPrice,
          description: description.trim(),
          imageUri,
        });
      } else {
        await createProduct({
          name: name.trim(),
          price: numericPrice,
          description: description.trim(),
          imageUri,
        });
      }
      setName('');
      setPrice('');
      setDescription('');
      setImageUri(undefined);
      setEditingProductId(null);
      setModalVisible(false);
      await loadProducts();
      showMessage(
        'Success',
        editingProductId ? 'Product updated successfully.' : 'Product added successfully.',
        'success'
      );
    } catch (error: unknown) {
      console.log('Create product error:', error);
      showMessage('Error', getErrorMessage(error, 'Failed to save product or upload image.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (item: Product) => {
    setEditingProductId(item.id);
    setName(item.name || '');
    setPrice(String(item.price ?? ''));
    setDescription(item.description || '');
    setImageUri(undefined);
    setModalVisible(true);
  };

  const handleDeleteProduct = async (id: string) => {
    const confirmDelete = async () => {
      try {
        await deleteProduct(id);
        await loadProducts();
        showMessage('Success', 'Product deleted successfully.', 'success');
      } catch (error: unknown) {
        showMessage('Error', getErrorMessage(error, 'Failed to delete product.'), 'error');
      }
    };

    if (Platform.OS === 'web') {
      const ok = window.confirm('Are you sure you want to delete this product?');
      if (ok) await confirmDelete();
      return;
    }

    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: () => confirmDelete() },
    ]);
  };

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((item) => (item.name || '').toLowerCase().includes(q));
  }, [data, search]);

  return (
    <>
      <Navbar title="Products" />

      <View style={styles.container}>

        {productsError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{productsError}</Text>
          </View>
        ) : null}

        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
          <TextInput
            placeholder="Search product..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingProductId(null);
            setName('');
            setPrice('');
            setDescription('');
            setImageUri(undefined);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addText}>+ Add Product</Text>
        </TouchableOpacity>

        {/* List */}
        {productsLoading && data.length === 0 ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={COLORS.secondary} />
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              productsLoading ? null : <Text style={styles.emptyList}>No products</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  source={{
                    uri:
                      item.image && item.image.startsWith('http')
                        ? item.image
                        : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                  }}
                  style={styles.image}
                />

                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
                  <Text style={styles.desc}>{item.description || 'Product'}</Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => openEditModal(item)}>
                    <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteProduct(item.id)}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

      </View>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingProductId ? 'Edit Product' : 'Add Product'}</Text>
            <TextInput
              ref={nameInputRef}
              style={styles.input}
              placeholder="Product name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Pressable style={styles.pickImageButton} onPress={requestAddProductImage}>
              <Text style={styles.pickImageText}>{imageUri ? 'Change Product Image' : 'Add Product Image'}</Text>
            </Pressable>
            {imageUri ? <Image source={{ uri: imageUri }} style={styles.previewImage} /> : null}

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveButton, saving && styles.disabledButton]}
                onPress={handleCreateProduct}
                disabled={saving}
              >
                <Text style={styles.saveText}>{saving ? 'Saving...' : editingProductId ? 'Update' : 'Save'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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

  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyList: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: 24,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    padding: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  pickImageButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  pickImageText: {
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: {
    textAlign: 'center',
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
  },
  saveText: {
    textAlign: 'center',
    color: COLORS.surface,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
});