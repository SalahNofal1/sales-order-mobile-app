import { PlayfairDisplay_700Bold, useFonts } from "@expo-google-fonts/playfair-display";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "../constants/colors";

export default function AboutUsScreen() {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  if (!fontsLoaded) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 16 }]}>
        <Text style={styles.title}>
          Beauty That{"\n"}
          Feels as Good{"\n"}
          as It Looks
        </Text>

        <Text style={styles.subtitle}>
          Inspired by Korean skincare, we create products for smooth hydrated glass skin and a natural, radiant glow.
          Simple, effective, and effortlessly feminine.
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.buttonPrimary} onPress={() => router.push("/login")}>
            <Text style={styles.buttonPrimaryText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push("/signup")}>
            <Text style={styles.buttonSecondaryText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imagesContainer}>
        <Animated.Image
          source={{
            uri: "https://www.koreancosmetic.cy/cdn/shop/files/IMG-7495.jpg?v=1734283943&width=1445",
          }}
          style={[styles.imageLarge, { transform: [{ translateY: floatAnim }] }]}
        />

        <Animated.Image
          source={{
            uri: "https://lacosmetique.com.au/cdn/shop/files/146_b2cab10f-115a-4810-9e10-168540abd7b4.png?v=1763617561&width=1500",
          }}
          style={[
            styles.imageSmall,
            {
              transform: [
                {
                  translateY: floatAnim.interpolate({
                    inputRange: [0, 10],
                    outputRange: [0, -10],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      <View style={styles.reviewContainer}>
        <View style={styles.reviewBox}>
          <Text style={styles.stars}>★★★★★</Text>
          <Text style={styles.reviewText}>
            &quot;Lightweight and gives a natural glow from the first use—my skin feels smoother and more radiant.&quot;
          </Text>
        </View>

        <View style={styles.reviewBox}>
          <Text style={styles.stars}>★★★★★</Text>
          <Text style={styles.reviewText}>
            &quot;345 Cream is lightweight and deeply hydrating—it gave my skin a smooth glassy glow from the first use.&quot;
          </Text>
        </View>
      </View>

      <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.contactBox}>
        <Text style={styles.contactTitle}>Contact Us</Text>

        <Text style={styles.contactText}>📞 +970 592934844</Text>
        <Text style={styles.contactText}>📧 beauty@luvit.com</Text>
        <Text style={styles.contactText}>📷 @LuvIt</Text>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 25,
    paddingBottom: 8,
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
    fontFamily: "PlayfairDisplay_700Bold",
    color: COLORS.primary,
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textSecondary,
    marginBottom: 22,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonPrimaryText: {
    color: COLORS.surface,
    fontWeight: "700",
  },
  buttonSecondary: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  buttonSecondaryText: {
    color: COLORS.secondary,
    fontWeight: "700",
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 12,
  },
  imageLarge: {
    width: "56%",
    height: 280,
    borderRadius: 20,
    resizeMode: "cover",
  },
  imageSmall: {
    width: "38%",
    height: 220,
    borderRadius: 16,
    resizeMode: "cover",
    marginTop: 36,
  },
  reviewContainer: {
    paddingHorizontal: 20,
    marginTop: 28,
    gap: 14,
  },
  reviewBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  stars: {
    fontSize: 16,
    color: "#CA8A04",
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textPrimary,
    fontStyle: "italic",
  },
  contactBox: {
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 8,
    padding: 22,
    borderRadius: 20,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.surface,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 15,
    color: COLORS.accent,
    marginBottom: 6,
  },
});
