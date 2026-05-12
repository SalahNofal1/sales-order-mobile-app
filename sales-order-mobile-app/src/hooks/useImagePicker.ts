import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

import { getErrorMessage } from '../utils/errorMessage';

type ToastType = 'success' | 'error' | 'info';

export type ShowPickerMessage = (title: string, message: string, type?: ToastType) => void;

const imagePickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  quality: 0.7,
};

export function useImagePicker(showMessage: ShowPickerMessage) {
  const [imageUri, setImageUri] = useState<string | undefined>();

  const applyPickedResult = useCallback((result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const pickFromGallery = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showMessage('Permission required', 'Please allow gallery access to select images.', 'info');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);
      applyPickedResult(result);
    } catch (error) {
      showMessage('Image picker', getErrorMessage(error, 'Could not open the gallery.'), 'error');
    }
  }, [applyPickedResult, showMessage]);

  const takePhoto = useCallback(async () => {
    if (Platform.OS === 'web') {
      showMessage(
        'Not available',
        'Taking a photo is not supported on web. Please pick an image from your gallery.',
        'info'
      );
      return;
    }
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        showMessage('Permission required', 'Please allow camera access to take a product photo.', 'info');
        return;
      }
      const result = await ImagePicker.launchCameraAsync(imagePickerOptions);
      applyPickedResult(result);
    } catch (error) {
      showMessage('Camera', getErrorMessage(error, 'Could not use the camera.'), 'error');
    }
  }, [applyPickedResult, showMessage]);

  const requestAddProductImage = useCallback(() => {
    if (Platform.OS === 'web') {
      void pickFromGallery();
      return;
    }
    Alert.alert('Add Product Image', 'Choose how to add the image', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Take Photo from Camera', onPress: () => void takePhoto() },
      { text: 'Pick Image from Gallery', onPress: () => void pickFromGallery() },
    ]);
  }, [pickFromGallery, takePhoto]);

  return { imageUri, setImageUri, requestAddProductImage };
}
