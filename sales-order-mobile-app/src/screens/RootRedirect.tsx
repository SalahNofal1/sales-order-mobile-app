import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect, type Href } from 'expo-router';
import { COLORS } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/userService';

type HomeRoute = '/login' | '/admin/employees' | '/warehouse/orders' | '/sales/home';

function resolveFallbackRole(email: string): 'admin' | 'warehouse' | 'sales' {
  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail === 'admin@gmail.com' ||
    normalizedEmail === 'admin2@hotmail.com' ||
    normalizedEmail === 'salahnofal602@gmail.com'
  ) {
    return 'admin';
  }

  if (normalizedEmail === 'warehouse@gmail.com') {
    return 'warehouse';
  }

  return 'sales';
}

function homeRouteForRole(role: string): HomeRoute {
  if (role === 'admin') return '/admin/employees';
  if (role === 'warehouse') return '/warehouse/orders';
  return '/sales/home';
}

export default function RootRedirect() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<HomeRoute>('/login');

  useEffect(() => {
    if (authLoading) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        if (!user) {
          if (!cancelled) {
            setTarget('/login');
          }
          return;
        }

        const profile = await getUserProfile(user.uid);
        const role = (profile as { role?: string } | null)?.role || resolveFallbackRole(user.email || '');

        if (!cancelled) {
          setTarget(homeRouteForRole(String(role).toLowerCase()));
        }
      } catch {
        if (!cancelled) {
          setTarget(user ? homeRouteForRole(resolveFallbackRole(user.email || '')) : '/login');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    run();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={target as Href} />;
}

