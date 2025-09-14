import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const { width } = Dimensions.get("window")

export default function HomeScreen() {
  const router = useRouter()

  return (
    <LinearGradient colors={["#E0F2FE", "#BFDBFE", "#DBEAFE"]} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to VitaLink</Text>
          <Text style={styles.subtitle}>Your Health, Our Priority</Text>
          <Text style={styles.description}>Access quality healthcare services with ease and confidence</Text>
        </View>

        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <Text style={styles.illustrationIcon}>👩‍💻</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.createAccountButton} onPress={() => router.push("/SignUpScreen")}>
            <Text style={styles.createAccountText}>Register as User</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(auth)/Login")}>
            <LinearGradient colors={["#10B981", "#059669"]} style={styles.loginButton}>
              <Text style={styles.loginText}>Log In</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, // Softer shadow for gentler appearance
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28, // Slightly larger for better hierarchy
    fontWeight: "bold",
    color: "#065F46", // Deep green for trust and health
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#059669", // Health-themed green
    marginBottom: 8,
    fontWeight: "500",
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  illustrationContainer: {
    marginBottom: 32,
  },
  illustration: {
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECFDF5", // Light green background for health theme
  },
  illustrationIcon: {
    fontSize: 48, // Larger medical symbol for better visibility
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  createAccountButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#10B981", // Green border for health theme
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  createAccountText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#065F46", // Dark green text for health theme
  },
  loginButton: {
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
})
