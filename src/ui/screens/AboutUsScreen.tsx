import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { COLORS } from "../../constants/colors";


import {
  PlayfairDisplay_700Bold,
  useFonts
} from "@expo-google-fonts/playfair-display";

export default function AboutUsScreen() {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

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
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {}
      <View style={styles.header}>
        <Text style={styles.title}>
          Beauty That{"\n"}
          Feels as Good{"\n"}
          as It Looks
        </Text>

        <Text style={styles.subtitle}>
         Inspired by Korean skincare, we create products for smooth
         hydrated glass skin and a natural, radiant glow.
          Simple, effective, and effortlessly feminine
        </Text>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push("/signup")} 
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.imagesContainer}>
        
        <Animated.Image
          source={{ uri: "https://www.koreancosmetic.cy/cdn/shop/files/IMG-7495.jpg?v=1734283943&width=1445" }}
          style={[
            styles.imageLarge,
            { transform: [{ translateY: floatAnim }] },
          ]}
        />

        <Animated.Image
          source={{ uri: "https://lacosmetique.com.au/cdn/shop/files/146_b2cab10f-115a-4810-9e10-168540abd7b4.png?v=1763617561&width=1500" }}
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

      {}
      <View style={styles.reviewContainer}>
        <View style={styles.reviewBox}>
          <Text style={styles.stars}>★★★★★</Text>
          <Text style={styles.reviewText}>
            "Lightweight and gives a natural glow from the first use—my skin feels smoother and more radiant."
          </Text>
        </View>

        <View style={styles.reviewBox}>
          <Text style={styles.stars}>★★★★★</Text>
          <Text style={styles.reviewText}>
            "345 Cream is lightweight and deeply hydrating—it gave my skin a smooth glassy glow from the first use."
          </Text>
        </View>
      </View>

      {}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primary]}
        style={styles.contactBox}
      >
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
    padding: 25,
    marginTop: 40,
  },

  title: {
    fontSize: 36,
    fontFamily: "PlayfairDisplay_700Bold", 
    color: COLORS.textPrimary,
    lineHeight: 44,
    letterSpacing: 1,
  },

  subtitle: {
    marginTop: 18,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },

  button: {
    marginTop: 22,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: "flex-start",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  imagesContainer: {
    marginTop: 25,
    alignItems: "center",
  },

  imageLarge: {
    width: "85%",
    height: 180,
    borderRadius: 25,
  },

  imageSmall: {
    width: "65%",
    height: 140,
    borderRadius: 25,
    marginTop: -40,
  },

  reviewContainer: {
    marginTop: 35,
    paddingHorizontal: 20,
  },

  reviewBox: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },

  stars: {
    color: "#FFD700",
    marginBottom: 5,
  },

  reviewText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  contactBox: {
    marginTop: 40,
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  contactTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  contactText: {
    color: "#fff",
    marginBottom: 5,
  },
});
