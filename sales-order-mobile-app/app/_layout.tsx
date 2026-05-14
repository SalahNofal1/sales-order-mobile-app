import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { AuthProvider } from '@/src/context/AuthContext';
import { CartProvider } from '@/src/context/CartContext';
import { UiProvider } from '@/src/context/UiContext';
import { ToastProvider } from '@/src/context/ToastContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Sidebar from '@/src/components/layout/Sidebar';
import ToastHost from '@/src/components/common/ToastHost';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <ToastProvider>
            <UiProvider>
              <CartProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="about-us" />
                  <Stack.Screen name="login" />
                  <Stack.Screen name="forgot-password" />
                  <Stack.Screen name="orders" />
                  <Stack.Screen name="products" />
                  <Stack.Screen name="cart" />
                  <Stack.Screen name="profile" />
                  <Stack.Screen name="signup" />
                  <Stack.Screen name="edit" />
                  <Stack.Screen name="warehouse/orders" />
                </Stack>
                <Sidebar />
                <ToastHost />
                <StatusBar style="auto" />
              </CartProvider>
            </UiProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
