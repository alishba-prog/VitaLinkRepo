"use client"

import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import type React from "react"
import { useState } from "react"
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

const { width } = Dimensions.get("window")
const API_BASE_URL = "http://192.168.1.21:8000/api"

interface ResetPayload {
  via: "email" | "whatsapp"
  email?: string
  phone?: string
}

interface ApiResponse {
  message?: string
}

 const Forgot: React.FC = () => {
  const router = useRouter()

  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [useWhatsApp, setUseWhatsApp] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = (phone: string): boolean => /^\+?\d{10,15}$/.test(phone)

  const handleResetPassword = async (): Promise<void> => {
    if (useWhatsApp) {
      if (!phone) {
        setError("Phone number is required")
        return
      }
      if (!validatePhone(phone.trim())) {
        setError("Enter phone in format +923001234567")
        return
      }
    } else {
      if (!email) {
        setError("Email is required")
        return
      }
      if (!validateEmail(email.trim())) {
        setError("Please enter a valid email")
        return
      }
    }

    try {
      setLoading(true)

      const payload: ResetPayload = useWhatsApp
        ? { via: "whatsapp", phone: phone.trim() }
        : { via: "email", email: email.trim() }

      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data: ApiResponse = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        setError(data.message || "Failed to send reset link")
      }
    } catch (err) {
      Alert.alert("Error", "Unable to connect to server")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = (text: string): void => {
    setEmail(text)
    if (error) setError("")
  }

  const handlePhoneChange = (text: string): void => {
    setPhone(text)
    if (error) setError("")
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
                <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 16 }}>
                  <TouchableOpacity onPress={() => setUseWhatsApp(false)}>
                    <Text style={[styles.toggle, !useWhatsApp && styles.toggleActive]}>Email</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setUseWhatsApp(true)}>
                    <Text style={[styles.toggle, useWhatsApp && styles.toggleActive]}>WhatsApp</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  {useWhatsApp ? (
                    <TextInput
                      style={[styles.input, error && styles.inputError]}
                      placeholder="Enter phone (+923001234567)"
                      value={phone}
                      onChangeText={handlePhoneChange}
                      keyboardType="phone-pad"
                    />
                  ) : (
                    <TextInput
                      style={[styles.input, error && styles.inputError]}
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={handleEmailChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                  {error && <Text style={styles.errorText}>{error}</Text>}
                </View>

                <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword} disabled={loading}>
                  <Text style={styles.resetButtonText}>
                    {loading ? "Sending..." : useWhatsApp ? "Send via WhatsApp" : "Send Reset Link"}
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
              <Text style={styles.successTitle}>{useWhatsApp ? "Check Your WhatsApp" : "Check Your Email"}</Text>
              <Text style={styles.successMessage}>We've sent your new password to {useWhatsApp ? phone : email}</Text>
              <TouchableOpacity style={styles.resetButton} onPress={() => router.push("/Login")}>
                <Text style={styles.resetButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  )
}

export default Forgot


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
  toggle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginHorizontal: 16,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  toggleActive: {
    color: "#10B981",
    borderBottomColor: "#10B981",
  },
})
