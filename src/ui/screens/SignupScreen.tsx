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

import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "../../../constants/colors";
import { signup } from "../../../services/AuthService";
import { createUserProfile } from "../../../services/UserService";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [jobType, setJobType] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // 🔥 Animation
  const floatAnim = useRef(new Animated.Value(0)).current;

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
        createdAt: new Date(),
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* 🔥 Animated Shapes */}
      <Animated.View
        style={[
          styles.shapeTop,
          { transform: [{ translateY: floatAnim }] },
        ]}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.gradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.shapeBottom,
          { transform: [{ translateY: floatAnim.interpolate({
            inputRange: [0, 10],
            outputRange: [0, -10],
          }) }] },
        ]}
      >
        <LinearGradient
          colors={[COLORS.secondary, COLORS.primary]}
          style={styles.gradient}
        />
      </Animated.View>

      {/* 🔥 Card */}
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
            style={[
              styles.input,
              focusedInput === item.key && styles.inputFocused,
            ]}
            onFocus={() => setFocusedInput(item.key)}
            onBlur={() => setFocusedInput(null)}
            value={item.value}
            onChangeText={item.set}
            secureTextEntry={item.secure}
            autoCapitalize={item.key === "email" ? "none" : "sentences"}
          />
        ))}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>

<TouchableOpacity
  onPress={() => {
    Alert.alert("Info", "Go to Login screen"); 
    // لاحقاً، يمكنك استبدالها بالانتقال الفعلي للـ Login
  }}
  activeOpacity={0.6}
>
  <Text style={styles.loginText}>
    You already have an account? <Text style={{ fontWeight: "700" }}>Login</Text>
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

  /* 🔥 Shapes */
  shapeTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 200,
    opacity: 0.4,
  },

  shapeBottom: {
    position: "absolute",
    bottom: -150,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: 200,
    opacity: 0.3,
  },

  gradient: {
    width: "100%",
    height: "100%",
    borderRadius: 200,
  },

  /* 🔥 Card */
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    borderRadius: 30,
    padding: 30,

    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
loginText: {
  marginTop: 15,
  fontSize: 13,
  color: COLORS.textSecondary,
  textAlign: "center",
  opacity: 0.8,
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
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  inputFocused: {
    borderBottomColor: COLORS.primary,
    transform: [{ scale: 1.02 }],
  },

  button: {
    marginTop: 25,
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 25,
    alignItems: "center",

    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },

  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});