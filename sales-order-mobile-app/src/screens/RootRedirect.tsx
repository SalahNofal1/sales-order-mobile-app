import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { COLORS } from '../constants/colors';
import { auth } from '../services/firebase/config';
import { getUserProfile } from '../services/userService';

export default function RootRedirect() {
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<
    '/login' | '/admin/employees' | '/products' | '/sales/home'
  >('/login');

  useEffect(() => {
    const run = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setTarget('/login');
          return;
        }

        const profile = await getUserProfile(user.uid);
        const role = profile?.role || 'sales';

        if (role === 'admin') setTarget('/admin/employees');
        else if (role === 'warehouse') setTarget('/products');
        else setTarget('/sales/home');
      } catch {
        setTarget('/login');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (!loading) {
    return <Redirect href={target} />;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
      <ActivityIndicator />
    </View>
  );
}

