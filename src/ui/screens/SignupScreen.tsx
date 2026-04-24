import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";

import { COLORS } from "../../../constants/colors";
import { signup } from "../../services/authService";
import { createUserProfile } from "../../services/userService";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [jobType, setJobType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const user = await signup(email, password);

      let role = "sales";
      if (email === "admin@gmail.com") role = "admin";
      else if (email === "warehouse@gmail.com") role = "warehouse";

      await createUserProfile(user.uid, {
        fullName,
        email,
        phone,
        address,
        jobType,
        role,
        salesLine: "",
        startDate: new Date().toISOString().split("T")[0],
      });

      Alert.alert("Success", "Account created successfully!");

      setFullName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setJobType("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* bubbles */}
      <Animated.View style={[styles.bubble, styles.b1, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b2, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b3, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b4, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b5, { transform: [{ translateY: floatAnim }] }]} />

      {/* shapes */}
      <Animated.View style={[styles.shapeTop, { transform: [{ translateY: floatAnim }] }]}>
        <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.gradient} />
      </Animated.View>

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
      >
        <LinearGradient colors={[COLORS.secondary, COLORS.primary]} style={styles.gradient} />
      </Animated.View>

      {/* card */}
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor={COLORS.textSecondary}
          style={[styles.input, focusedInput === "name" && styles.inputFocused]}
          onFocus={() => setFocusedInput("name")}
          onBlur={() => setFocusedInput(null)}
          value={fullName}
          onChangeText={setFullName}
        />

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

        <TextInput
          placeholder="Phone"
          placeholderTextColor={COLORS.textSecondary}
          style={[styles.input, focusedInput === "phone" && styles.inputFocused]}
          onFocus={() => setFocusedInput("phone")}
          onBlur={() => setFocusedInput(null)}
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          placeholder="Address"
          placeholderTextColor={COLORS.textSecondary}
          style={[styles.input, focusedInput === "address" && styles.inputFocused]}
          onFocus={() => setFocusedInput("address")}
          onBlur={() => setFocusedInput(null)}
          value={address}
          onChangeText={setAddress}
        />

        {}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Password"
            placeholderTextColor={COLORS.textSecondary}
            style={[styles.input, focusedInput === "password" && styles.inputFocused]}
            onFocus={() => setFocusedInput("password")}
            onBlur={() => setFocusedInput(null)}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            activeOpacity={0.7}
          >
            {showPassword ? (
              <EyeOff size={20} color={COLORS.primary} />
            ) : (
              <Eye size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor={COLORS.textSecondary}
            style={[styles.input, focusedInput === "confirmPassword" && styles.inputFocused]}
            onFocus={() => setFocusedInput("confirmPassword")}
            onBlur={() => setFocusedInput(null)}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeButton}
            activeOpacity={0.7}
          >
            {showConfirmPassword ? (
              <EyeOff size={20} color={COLORS.primary} />
            ) : (
              <Eye size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginText}>
            You already have an account? <Text style={styles.link}>Login</Text>
          </Text>
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
  b5: { width: 50, height: 50, top: 140, left: 120 },

  shapeTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 200,
    opacity: 0.3,
  },

  shapeBottom: {
    position: "absolute",
    bottom: -150,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: 200,
    opacity: 0.2,
  },

  gradient: {
    width: "100%",
    height: "100%",
    borderRadius: 200,
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

  inputWrapper: {
    position: "relative",
  },

  eyeButton: {
    position: "absolute",
    right: 0,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 10,
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
    fontSize: 16,
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
