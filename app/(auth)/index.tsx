import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

const Index: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/HomeScreen"); // Navigate after 3 sec
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#E0F2FE", "#BFDBFE", "#DBEAFE"]}
      style={styles.container}
    >
      <Image
        source={require("../../assets/images/heart.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.appName}>VitaLink</Text>
      <Text style={styles.tagline}>Connecting patients with healthcare</Text>
      <ActivityIndicator size="large" color="#0E9F6E" style={{ marginTop: 20 }} />
    </LinearGradient>
  );
};

export default Index;

type Styles = {
  container: ViewStyle;
  logo: ImageStyle;
  appName: TextStyle;
  tagline: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 120, height: 120, marginBottom: 16 },
  appName: { fontSize: 28, fontWeight: "700", color: "#0F172A" },
  tagline: { fontSize: 14, color: "#374151", marginTop: 4 },
});
