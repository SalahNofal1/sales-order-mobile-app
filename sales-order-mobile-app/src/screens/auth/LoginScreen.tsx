import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/colors";
import { useToast } from "../../context/ToastContext";
import { login } from "../../services/authService";
import { getUserProfile } from "../../services/userService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();

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
  }, [floatAnim]);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast({ type: "error", title: "Missing fields", message: "Please enter email and password." });
      return;
    }

    try {
      setLoading(true);

      const user = await login(email, password);
      const profile = await getUserProfile(user.uid);
      const normalizedEmail = (user.email || "").trim().toLowerCase();

      let fallbackRole: string = "sales";
      if (
        normalizedEmail === "admin@gmail.com" ||
        normalizedEmail === "admin2@hotmail.com" ||
        normalizedEmail === "salahnofal602@gmail.com"
      )
        fallbackRole = "admin";
      else if (normalizedEmail === "warehouse@gmail.com") fallbackRole = "warehouse";

      const role = (profile as any)?.role || fallbackRole;

      if (role === "admin") router.replace("/admin/employees");
      else if (role === "warehouse") router.replace("/warehouse/orders");
      else router.replace("/sales/home");

    } catch (error: any) {
      showToast({
        type: "error",
        title: "Login failed",
        message: error?.message || "Please check your email and password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeRoot} edges={["top"]}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      {}
      <Animated.View style={[styles.bubble, styles.b1, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b2, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b3, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b4, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b5, { transform: [{ translateY: floatAnim }] }]} />

      {}
      <Animated.View
        style={[
          styles.shapeBottom,
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

      {/* 🔥 CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

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

        <View
          style={[
            styles.passwordField,
            focusedInput === "password" && styles.inputFocused,
          ]}
        >
          <TextInput
            placeholder="Password"
            placeholderTextColor={COLORS.textSecondary}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            onFocus={() => setFocusedInput("password")}
            onBlur={() => setFocusedInput(null)}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() => setShowPassword((current) => !current)}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            style={styles.passwordToggle}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/forgot-password")} disabled={loading}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.loginText}>
            Don’t have an account? <Text style={styles.link}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeRoot: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
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
  b5: { width: 50, height: 50, top: 140, left: 120 },

  

  shapeBottom: {
    position: "absolute",
    bottom: -150,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: 200,
    opacity: 0.2,
    backgroundColor: COLORS.secondary,
  },

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
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    width: "100%",
    paddingVertical: 12,
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

  inputFocused: {
    borderBottomColor: COLORS.primary,
  },

  passwordField: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 8,
  },

  passwordToggle: {
    paddingVertical: 8,
    paddingLeft: 4,
  },

  forgotText: {
    alignSelf: "flex-end",
    marginTop: -8,
    marginBottom: 8,
    color: COLORS.secondary,
    fontWeight: "700",
    fontSize: 14,
  },

  button: {
    marginTop: 25,
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
  },

  buttonText: {
    color: COLORS.background,
    fontWeight: "bold",
  },

  loginText: {
    marginTop: 15,
    textAlign: "center",
    color: COLORS.textSecondary,
  },

  link: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});
