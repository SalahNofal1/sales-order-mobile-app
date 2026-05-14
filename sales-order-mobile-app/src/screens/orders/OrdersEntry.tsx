import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { auth } from '../../services/firebase/config';
import { getUserProfile } from '../../services/userService';

export default function OrdersEntry() {
  const [target, setTarget] = useState<'/login' | '/sales/orders' | '/warehouse/orders' | '/admin/orders'>('/login');
  const [loading, setLoading] = useState(true);

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

        if (role === 'warehouse') setTarget('/warehouse/orders');
        else if (role === 'admin') setTarget('/admin/orders');
        else setTarget('/sales/orders');
      } catch {
        setTarget('/login');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (!loading) return <Redirect href={target} />;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
      <ActivityIndicator />
    </View>
  );
}

