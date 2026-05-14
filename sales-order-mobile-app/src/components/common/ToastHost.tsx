import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../../context/ToastContext';
import { COLORS } from '../../constants/colors';

function getToastTheme(type: 'success' | 'error' | 'info') {
  switch (type) {
    case 'success':
      return { bg: COLORS.success, icon: 'checkmark-circle' as const };
    case 'error':
      return { bg: COLORS.error, icon: 'close-circle' as const };
    case 'info':
    default:
      return { bg: COLORS.info, icon: 'information-circle' as const };
  }
}

export default function ToastHost() {
  const { toast, hideToast } = useToast();
  const insets = useSafeAreaInsets();

  const visible = !!toast;
  const anim = useRef(new Animated.Value(0)).current;

  const theme = useMemo(() => getToastTheme(toast?.type || 'info'), [toast?.type]);

  useEffect(() => {
    if (!toast) return;

    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();

    const duration = toast.durationMs ?? 2200;
    const t = setTimeout(() => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) hideToast();
      });
    }, duration);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast?.id]);

  if (!visible) return null;

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-18, 0] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View pointerEvents="none" style={[styles.wrap, { top: insets.top + 10 }]}>
      <Animated.View
        style={[
          styles.toast,
          { backgroundColor: theme.bg, opacity, transform: [{ translateY }] },
        ]}
      >
        <Ionicons name={theme.icon} size={20} color={COLORS.surface} />
        <View style={styles.textCol}>
          {toast?.title ? <Text style={styles.title}>{toast.title}</Text> : null}
          <Text style={styles.message} numberOfLines={2}>
            {toast?.message}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 9999,
    elevation: 50,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  textCol: { flex: 1 },
  title: { color: COLORS.surface, fontWeight: '900', fontSize: 13 },
  message: { marginTop: 2, color: COLORS.surface, fontWeight: '700', fontSize: 12.5 },
});

