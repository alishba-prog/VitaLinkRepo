import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


const { width } = Dimensions.get("window");
const API_BASE_URL = "http://192.168.1.16:8000/api";

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [useEmail, setUseEmail] = useState(true); // ✅ Toggle state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone); // basic validation
  const validatePhone = (phone) => /^\+[1-9]\d{7,14}$/.test(phone);
  const validatePassword = (password) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password);

  const handleSignup = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();

    const newErrors = {};
    if (!trimmedName) newErrors.fullName = "Full name is required";

    if (useEmail) {
      if (!trimmedEmail) newErrors.email = "Email is required";
      else if (!validateEmail(trimmedEmail))
        newErrors.email = "Please enter a valid email";
    } else {
      if (!trimmedPhone) newErrors.phone = "Phone number is required";
      else if (!validatePhone(trimmedPhone))
        newErrors.phone = "Enter valid phone number";
    }

    if (!trimmedPassword) newErrors.password = "Password is required";
    else if (!validatePassword(trimmedPassword))
      newErrors.password =
        "Password must be 8+ characters with uppercase, lowercase, and number";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        fullName: trimmedName,
        password: trimmedPassword,
      };
      if (useEmail) payload.email = trimmedEmail;
      else payload.phone = trimmedPhone;

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => router.push("/Login") },
        ]);
      } else {
        Alert.alert("Error", data.message || "Signup failed");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    Alert.alert(
      "Google Sign Up",
      "Google authentication would be implemented here"
    );
  };

  return (
    <LinearGradient
      colors={["#E0F2FE", "#BFDBFE", "#DBEAFE"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Join VitaLink</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={[styles.input, errors.fullName && styles.inputError]}
                  placeholder="Enter full name"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errors.fullName)
                      setErrors({ ...errors, fullName: null });
                  }}
                />
                {errors.fullName && (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                )}
              </View>

              {/* ✅ Toggle between Email & Phone */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    useEmail && styles.toggleButtonActive,
                  ]}
                  onPress={() => setUseEmail(true)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      useEmail && styles.toggleTextActive,
                    ]}
                  >
                    Email
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !useEmail && styles.toggleButtonActive,
                  ]}
                  onPress={() => setUseEmail(false)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      !useEmail && styles.toggleTextActive,
                    ]}
                  >
                    Phone
                  </Text>
                </TouchableOpacity>
              </View>

              {useEmail ? (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Enter email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email)
                        setErrors({ ...errors, email: null });
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>
              ) : (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={[styles.input, errors.phone && styles.inputError]}
                    placeholder="Enter phone number"
                    placeholderTextColor="#9CA3AF"
                    value={phone}
                    onChangeText={(text) => {
                      setPhone(text);
                      if (errors.phone)
                        setErrors({ ...errors, phone: null });
                    }}
                    keyboardType="phone-pad"
                  />
                  {errors.phone && (
                    <Text style={styles.errorText}>{errors.phone}</Text>
                  )}
                </View>
              )}

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Enter password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password)
                      setErrors({ ...errors, password: null });
                  }}
                  secureTextEntry
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text style={styles.signupButtonText}>
                  {loading ? "Signing Up..." : "Start Your Health Journey"}
                </Text>
              </TouchableOpacity>

              {/* Social Buttons (unchanged) */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or sign up with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                  <Text style={[styles.socialIcon, { color: "#1877F2" }]}>f</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleGoogleSignup}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.socialIcon, { color: "#DB4437" }]}>G</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                  <Text style={[styles.socialIcon, { fontSize: 28 }]}>🍎</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.loginPrompt}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/Login")}>
                  <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    width: width - 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 28,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  backButton: {
    alignItems: "flex-start",
    marginBottom: 28,
  },
  backText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 0.5,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#065F46",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  userTypeContainer: {
    flexDirection: "row",
    marginBottom: 32,
    backgroundColor: "#ECFDF5",
    borderRadius: 30,
    padding: 5,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 25,
    transitionDuration: "300ms",
  },
  userTypeButtonActive: {
    backgroundColor: "#10B981",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  userTypeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },
  userTypeTextActive: {
    color: "#FFFFFF",
  },
  form: {
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  input: {
    height: 52,
    borderColor: "#D1D5DB",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    backgroundColor: "#F9FAFB",
    shadowColor: "#E0E7FF",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  inputError: {
    borderColor: "#EF4444",
    shadowColor: "#FCA5A5",
  },
  errorText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#EF4444",
    marginTop: 4,
    fontStyle: "italic",
  },
  signupButton: {
    backgroundColor: "#10B981",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 7,
    marginBottom: 32,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginHorizontal: 10,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 32,
  },
  socialButton: {
    width: 54,
    height: 54,
    backgroundColor: "#F3F4F6",
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#A78BFA",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  socialIcon: {
    fontSize: 26,
    fontWeight: "700",
    color: "#374151",
    textAlignVertical: "center",
  },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6B7280",
  },
  loginLink: {
    fontSize: 15,
    fontWeight: "700",
    color: "#10B981",
    marginLeft: 6,
    textDecorationLine: "underline",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 20,
    marginBottom: 20,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 16,
  },
  toggleButtonActive: {
    backgroundColor: "#10B981",
    elevation: 4,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
});
