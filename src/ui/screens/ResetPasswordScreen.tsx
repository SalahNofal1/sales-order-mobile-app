import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";

import { COLORS } from "../../constants/colors";
import { auth } from "../../services/firebase/config";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const router = useRouter();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 12,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);

      Alert.alert(
        "Email Sent 📩",
        "Check your email to reset your password",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "No account found with this email");
      } else {
        Alert.alert("Error", "Something went wrong");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* 💜 Bubbles */}
      <Animated.View style={[styles.bubble, styles.b1, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b2, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b3, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b4, { transform: [{ translateY: floatAnim }] }]} />

      {/* 💜 Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password?</Text>

        <Text style={styles.subtitle}>
          Enter your email and we’ll send you a reset link 💌
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor={COLORS.textSecondary}
          style={[styles.input, focusedInput === "email" && styles.inputFocused]}
          onFocus={() => setFocusedInput("email")}
          onBlur={() => setFocusedInput(null)}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>SEND RESET LINK</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  bubble: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: COLORS.secondary,
    opacity: 0.08,
  },

  b1: { width: 120, height: 120, top: 80, left: 40 },
  b2: { width: 80, height: 80, bottom: 100, right: 50 },
  b3: { width: 60, height: 60, top: 200, right: 90 },
  b4: { width: 100, height: 100, bottom: 200, left: 60 },

  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    borderRadius: 30,
    padding: 30,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginBottom: 25,
  },

  input: {
    width: "100%",
    paddingVertical: 12,
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    color: COLORS.textPrimary,
  },

  inputFocused: {
    borderBottomColor: COLORS.primary,
  },

  button: {
    marginTop: 10,
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
  },

  buttonText: {
    color: COLORS.background,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  backText: {
    marginTop: 15,
    textAlign: "center",
    color: COLORS.primary,
    fontWeight: "600",
  },
});
