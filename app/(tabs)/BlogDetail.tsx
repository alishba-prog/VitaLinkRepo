import { Feather } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import type React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { WebView } from "react-native-webview"

interface BlogData {
  id: string
  title: string
  excerpt: string
  image?: string
  content: string
  source: string
  url?: string
}

const BlogDetail: React.FC = () => {
  const router = useRouter()
  const params = useLocalSearchParams()

  let blogData: BlogData | null = null
  try {
    blogData = params.blog ? JSON.parse(decodeURIComponent(params.blog as string)) : null
  } catch (err) {
    console.warn("Failed to parse blog param:", err)
  }

  if (!blogData) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16 }}>No article data available.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: "#0F172A" }}>Go back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Floating Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>

      {blogData.url ? (
        <WebView source={{ uri: blogData.url }} style={{ flex: 1 }} />
      ) : (
        <View style={styles.center}>
          <Text style={{ fontSize: 16, textAlign: "center", padding: 20 }}>
            No full article link available for this blog.
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  backBtn: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 10,
    backgroundColor: "#0F172A",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
})

export default BlogDetail
