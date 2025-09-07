import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ for storing token securely
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window")

// ✅ Auto-detect backend address for emulator vs local
const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000/api"
    : "http://localhost:8000/api"

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleLogin = async () => {
    const newErrors = {}

    if (!email) newErrors.email = "Email is required"
    else if (!validateEmail(email.trim())) newErrors.email = "Please enter a valid email"

    if (!password.trim()) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email:email.trim(), password:password.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        // ✅ Save token to AsyncStorage if user checked "Remember Me"
        if (rememberMe) {
          await AsyncStorage.setItem("token", data.token)
        }
        Alert.alert("Success", "Logged in successfully!", [
          { text: "OK", onPress: () => router.replace("/UserScreen") },
        ])
      } else {
        Alert.alert("Error", data.message || "Invalid credentials")
      }
    } catch (error) {
      Alert.alert("Error", "Unable to connect to server")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Google authentication would be implemented here")
  }

  return (
    <LinearGradient colors={["#E0F2FE", "#BFDBFE", "#DBEAFE"]} style={styles.container}>
      <View style={styles.container}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Welcome to VitaLink</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text)
                  if (errors.email) setErrors({ ...errors, email: null })
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  if (errors.password) setErrors({ ...errors, password: null })
                }}
                secureTextEntry
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/Forgot")}>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? "Logging in..." : "Log In"}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Sign in with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>f</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                <Text style={styles.socialIcon}>G</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>🍎</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.signupPrompt}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/SignUpScreen")}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    width: width - 32,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: "#10B981",
    fontWeight: "500",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#065F46",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#10B981",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 14,
    color: "#6B7280",
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  socialButton: {
    width: 48,
    height: 48,
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  signupPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#6B7280",
  },
  signupLink: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
  },
})
