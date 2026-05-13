import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, type User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { STORAGE_KEYS } from '../constants/storageKeys';
import { getErrorMessage } from '../utils/errorMessage';
import { auth } from '../services/firebase/config';

export type LastUserSnapshot = {
  uid: string;
  email: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  lastSignedInSnapshot: LastUserSnapshot | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  lastSignedInSnapshot: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSignedInSnapshot, setLastSignedInSnapshot] = useState<LastUserSnapshot | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.LAST_USER_SNAPSHOT);
        if (cancelled || !raw) return;
        const parsed = JSON.parse(raw) as unknown;
        if (
          parsed &&
          typeof parsed === 'object' &&
          typeof (parsed as LastUserSnapshot).uid === 'string'
        ) {
          setLastSignedInSnapshot({
            uid: (parsed as LastUserSnapshot).uid,
            email: typeof (parsed as LastUserSnapshot).email === 'string' ? (parsed as LastUserSnapshot).email : null,
          });
        }
      } catch (error) {
        console.warn('Auth snapshot load:', getErrorMessage(error));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      (async () => {
        try {
          if (nextUser) {
            const snap: LastUserSnapshot = { uid: nextUser.uid, email: nextUser.email ?? null };
            setLastSignedInSnapshot(snap);
            await AsyncStorage.setItem(STORAGE_KEYS.LAST_USER_SNAPSHOT, JSON.stringify(snap));
          } else {
            setLastSignedInSnapshot(null);
            await AsyncStorage.removeItem(STORAGE_KEYS.LAST_USER_SNAPSHOT);
          }
        } catch (error) {
          console.warn('Auth snapshot persist:', getErrorMessage(error));
        }
      })();
    });
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({ user, loading, lastSignedInSnapshot }),
    [user, loading, lastSignedInSnapshot]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
