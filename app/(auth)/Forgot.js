// import { LinearGradient } from "expo-linear-gradient"
// import { useRouter } from "expo-router"
// import { useState } from "react"
// import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

// const { width } = Dimensions.get("window")

// export default function ForgotPasswordScreen() {
//   const router = useRouter()
//   const [email, setEmail] = useState("")
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const [error, setError] = useState("")

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     return emailRegex.test(email)
//   }

//   const handleResetPassword = () => {
//     if (!email) {
//       setError("Email is required")
//     } else if (!validateEmail(email)) {
//       setError("Please enter a valid email")
//     } else {
//       setIsSubmitted(true)
//     }
//   }

//   return (
//     <LinearGradient colors={["#E0F2FE", "#BFDBFE", "#DBEAFE"]} style={styles.container}>
//       <View style={styles.container}>
//         <View style={styles.card}>
//           <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//             <Text style={styles.backText}>← Back</Text>
//           </TouchableOpacity>

//           {!isSubmitted ? (
//             <>
//               <View style={styles.header}>
//                 <Text style={styles.title}>Forgot Password?</Text>
//                 <Text style={styles.subtitle}>No worries! We'll help you recover</Text>
//                 <Text style={styles.subtitle}>your VitaLink account securely.</Text>
//               </View>

//               <View style={styles.form}>
//                 <View style={styles.inputContainer}>
//                   <TextInput
//                     style={[styles.input, error && styles.inputError]}
//                     placeholder="Enter your email"
//                     value={email}
//                     onChangeText={(text) => {
//                       setEmail(text)
//                       if (error) setError("")
//                     }}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                   />
//                   {error && <Text style={styles.errorText}>{error}</Text>}
//                 </View>

//                 <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
//                   <Text style={styles.resetButtonText}>Send Reset Link</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={() => router.push("/Login")}>
//                   <Text style={styles.backToLogin}>Back to Login</Text>
//                 </TouchableOpacity>
//               </View>
//             </>
//           ) : (
//             <View style={styles.successContainer}>
//               <View style={styles.successIcon}>
//                 <Text style={styles.successIconText}>✓</Text>
//               </View>
//               <Text style={styles.successTitle}>Check Your Email</Text>
//               <Text style={styles.successMessage}>We've sent a secure password reset link to {email}</Text>
//               <TouchableOpacity style={styles.resetButton} onPress={() => router.push("/login")}>
//                 <Text style={styles.resetButtonText}>Back to Login</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </View>
//     </LinearGradient>
//   )
// }

import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

const { width } = Dimensions.get("window")

// Auto-detect backend address
const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000/api"
    : "http://localhost:8000/api"

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleResetPassword = async () => {
    if (!email) {
      setError("Email is required")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true) // ✅ Show success UI
      } else {
        setError(data.message || "Failed to send reset email")
      }
    } catch (err) {
      Alert.alert("Error", "Unable to connect to server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <LinearGradient colors={["#E0F2FE", "#BFDBFE", "#DBEAFE"]} style={styles.container}>
      <View style={styles.container}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {!isSubmitted ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>No worries! We'll help you recover</Text>
                <Text style={styles.subtitle}>your VitaLink account securely.</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, error && styles.inputError]}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text)
                      if (error) setError("")
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {error && <Text style={styles.errorText}>{error}</Text>}
                </View>

                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  <Text style={styles.resetButtonText}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/Login")}>
                  <Text style={styles.backToLogin}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Text style={styles.successIconText}>✓</Text>
              </View>
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successMessage}>
                We've sent a secure password reset link to {email}
              </Text>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => router.push("/Login")}
              >
                <Text style={styles.resetButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  )
}

// keep your styles exactly as you already have

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    width: width - 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    alignItems: "flex-start",
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#065F46",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#4B5563",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "400",
    color: "#1E293B",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#EF4444",
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: "#10B981",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  backToLogin: {
    fontSize: 16,
    fontWeight: "400",
    color: "#10B981",
    textAlign: "center",
  },
  successContainer: {
    alignItems: "center",
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#065F46",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    fontWeight: "400",
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 24,
  },
})
