import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useEffect } from "react"
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native"

const { width, height } = Dimensions.get("window")

export default function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/HomeScreen")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <LinearGradient colors={["#E0F2FE", "#BFDBFE", "#DBEAFE"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🏥</Text>
          </View>
          <Text style={styles.appName}>VitaLink</Text>
          <Text style={styles.tagline}>Your Health, Our Priority</Text>
        </View>
        <ActivityIndicator size="large" color="#10B981" style={styles.spinner} />
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
  content: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 128,
    height: 128,
    backgroundColor: "#FFFFFF",
    borderRadius: 64,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 48,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#065F46",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: "#059669",
  },
  spinner: {
    marginTop: 16,
  },
})
