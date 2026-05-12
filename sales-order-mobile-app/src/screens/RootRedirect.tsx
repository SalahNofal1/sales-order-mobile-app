import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect, type Href } from 'expo-router';
import { COLORS } from '../constants/colors';
import { auth } from '../services/firebase/config';
import { getUserProfile } from '../services/userService';

export default function RootRedirect() {
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<
    '/about-us' | '/login' | '/admin/employees' | '/products' | '/sales/home'
  >('/about-us');

  useEffect(() => {
    const run = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setTarget('/about-us');
          return;
        }

        const profile = await getUserProfile(user.uid);
        const role = profile?.role || 'sales';

        if (role === 'admin') setTarget('/admin/employees');
        else if (role === 'warehouse') setTarget('/products');
        else setTarget('/sales/home');
      } catch {
        setTarget('/about-us');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (!loading) {
    return <Redirect href={target as Href} />;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
      <ActivityIndicator />
    </View>
  );
}

