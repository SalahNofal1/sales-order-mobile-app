import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

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
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill all required fields");
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
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>

      {}
      <Animated.View style={[styles.bubble, styles.b1, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b2, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b3, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b4, { transform: [{ translateY: floatAnim }] }]} />
      <Animated.View style={[styles.bubble, styles.b5, { transform: [{ translateY: floatAnim }] }]} />

      {}
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

      {}
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>

        {[
          { key: "name", value: fullName, set: setFullName, placeholder: "Full Name" },
          { key: "email", value: email, set: setEmail, placeholder: "Email" },
          { key: "phone", value: phone, set: setPhone, placeholder: "Phone" },
          { key: "address", value: address, set: setAddress, placeholder: "Address" },
          { key: "password", value: password, set: setPassword, placeholder: "Password", secure: true },
        ].map((item) => (
          <TextInput
            key={item.key}
            placeholder={item.placeholder}
            placeholderTextColor={COLORS.textSecondary}
            style={[styles.input, focusedInput === item.key && styles.inputFocused]}
            onFocus={() => setFocusedInput(item.key)}
            onBlur={() => setFocusedInput(null)}
            value={item.value}
            onChangeText={item.set}
            secureTextEntry={item.secure}
            autoCapitalize={item.key === "email" ? "none" : "sentences"}
          />
        ))}

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

  /* shapes */
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

  bigBubble1: {
  position: "absolute",
  width: 70,
  height: 30,
  borderRadius: 30,
  top: -130,
  right: -90,
},

bigBubble2: {
  position: "absolute",
  width: 200,
  height: 10,
  borderRadius: 30,
  bottom: -140,
  left: -100,
},

bubbleGradient: {
  width: "10%",
  height: "10%",
  borderRadius: 20,
},
});

