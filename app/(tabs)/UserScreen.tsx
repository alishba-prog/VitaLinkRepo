import { Feather, MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import type React from "react"
import { useEffect, useState } from "react"
import {
  ActivityIndicator, Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"

const { width } = Dimensions.get("window")
const NEWSDATA_API_KEY = "pub_ea757eba630d4d35873fd7ab7fa83f0e"

interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  avatar: string
}

interface BlogItem {
  id: string
  title: string
  excerpt: string
  image?: string
  content: string
  link?: string
  source: string
}

interface SpecialtyItem {
  key: string
  icon: string
}

interface NewsDataResponse {
  results?: any[]
}

// Dummy doctors data
const DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Sarah Khan",
    specialty: "Cardiologist",
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop",
  },
  {
    id: "d2",
    name: "Dr. Ahmed Ali",
    specialty: "Dermatologist",
    rating: 4.7,
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop",
  },
]

const UserScreen: React.FC = () => {
  const router = useRouter()
  const [blogs, setBlogs] = useState<BlogItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchBlogs = async (): Promise<void> => {
      try {
        const res = await fetch(
          `https://newsdata.io/api/1/news?country=pk&category=health&apikey=${NEWSDATA_API_KEY}&language=en`,
        )
        const json: NewsDataResponse = await res.json()

        if (!json.results) return

        const mapped: BlogItem[] = json.results.map((item: any, idx: number) => ({
          id: item.link || `news_${idx}`,
          title: item.title,
          excerpt: item.description || "",
          image: item.image_url,
          content: item.content || item.description || "",
          link: item.link || item.url || null,
          source: item.source_id,
        }))

        setBlogs(mapped.slice(0, 5))
      } catch (e) {
        console.log("Error fetching blogs:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const handleBlogPress = (blog: BlogItem): void => {
    const encoded = encodeURIComponent(
      JSON.stringify({
        id: blog.id,
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content || blog.excerpt,
        image: blog.image,
        url: blog.link,
        source: blog.source,
      }),
    )

    router.push({
      pathname: "/BlogDetail",
      params: { blog: encoded },
    })
  }

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <TouchableOpacity style={styles.doctorCard}>
      <Image source={{ uri: item.avatar }} style={styles.doctorAvatar} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpec}>{item.specialty}</Text>
        <View style={styles.ratingRow}>
          <Feather name="star" size={14} color="#10B981" />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const specialties: SpecialtyItem[] = [
    { key: "Cardiology", icon: "heart" },
    { key: "Neurology", icon: "zap" },
    { key: "Pediatrics", icon: "smile" },
    { key: "Dermatology", icon: "droplet" },
  ]

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7FBFF" />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>VitaLink</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="search" size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Top quick cards */}
        <View style={styles.topCardsRow}>
          <TouchableOpacity style={[styles.quickCard]} onPress={() => router.push("/ConsultDoctorScreen")}>
            <Feather name="user-check" size={28} color="#0E9F6E" />
            <Text style={styles.quickCardText}>Consult{`\n`}Doctor</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickCard]}>
            <Feather name="activity" size={28} color="#0E9F6E" />
            <Text style={styles.quickCardText}>Book{`\n`}Lab Test</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <TextInput placeholder="Search for doctors" placeholderTextColor="#6B7280" style={styles.searchInput} />
          <TouchableOpacity style={styles.micBtn}>
            <Feather name="mic" size={18} color="#0E9F6E" />
          </TouchableOpacity>
        </View>

        {/* Ask Vita AI card */}
        <TouchableOpacity style={styles.aiCard}>
          <View style={styles.aiRow}>
            <View style={styles.aiIconWrap}>
              <Feather name="message-circle" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>Ask Vita AI</Text>
              <Text style={styles.aiSubtitle}>AI-powered symptom checker</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#0F172A" />
          </View>

          <View style={styles.chipsRow}>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>Fever</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>Headache</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>Cough</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Browse by specialty */}
        <Text style={styles.sectionTitle}>Browse by Specialty</Text>
        <View style={styles.specialtyRow}>
          {specialties.map((s) => (
            <TouchableOpacity key={s.key} style={styles.specItem}>
              <View style={styles.specIcon}>
                <Feather name={s.icon as any} size={20} color="#0E9F6E" />
              </View>
              <Text style={styles.specText}>{s.key}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommended doctors */}
        <Text style={styles.sectionTitle}>Recommended Doctors</Text>
        <FlatList
          data={DOCTORS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingLeft: 16 }}
          renderItem={renderDoctorItem}
        />

        {/* Health Tips & Blogs */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => router.push("/BlogsScreen")}>
            <Text style={styles.sectionTitle}>Health News & Blogs</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/BlogsScreen")}>
            <Text style={{ color: "#0E9F6E", fontWeight: "600" }}>See All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.blogSection}>
          {loading ? (
            <ActivityIndicator size="small" color="#0F172A" style={{ marginLeft: 16 }} />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
            >
              {blogs.slice(0, 5).map((b) => (
                <TouchableOpacity key={b.id} style={styles.blogCard} onPress={() => handleBlogPress(b)}>
                  {b.image ? (
                    <Image source={{ uri: b.image }} style={styles.blogThumb} />
                  ) : (
                    <View style={[styles.blogThumb, { backgroundColor: "#ddd" }]} />
                  )}
                  <Text style={styles.blogTitle} numberOfLines={1}>
                    {b.title}
                  </Text>
                  <Text style={styles.blogExcerpt} numberOfLines={2}>
                    {b.excerpt}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Arrow Card */}
              {blogs.length > 5 && (
                <TouchableOpacity
                  style={[styles.blogCard, { justifyContent: "center", alignItems: "center" }]}
                  onPress={() => router.push("/BlogsScreen")}
                >
                  <Feather name="arrow-right" size={28} color="#0E9F6E" />
                  <Text style={{ marginTop: 6, color: "#0E9F6E", fontWeight: "700" }}>See All</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="home" size={20} color="#0F172A" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="calendar" size={20} color="#6B7280" />
          <Text style={styles.navText}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="user" size={20} color="#6B7280" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const PADDING = 16
const CARD_RADIUS = 14

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7FBFF",
  },
  container: {
    paddingHorizontal: PADDING,
    backgroundColor: "#F7FBFF",
  },
  header: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  iconBtn: {
    padding: 8,
    borderRadius: 10,
  },
  topCardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  quickCard: {
    width: (width - PADDING * 2 - 12) / 2,
    backgroundColor: "#E9F7F0",
    borderRadius: CARD_RADIUS,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  quickCardText: {
    color: "#0F172A",
    fontWeight: "600",
    marginLeft: 10,
  },
  searchRow: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0F172A",
    elevation: 1,
  },
  micBtn: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  aiCard: {
    backgroundColor: "#DFF6F0",
    borderRadius: CARD_RADIUS,
    padding: 14,
    marginBottom: 16,
  },
  aiRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  aiIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#0E9F6E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  aiTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  aiSubtitle: { fontSize: 12, color: "#0F172A", opacity: 0.8 },
  chipsRow: { flexDirection: "row" },
  chip: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: { color: "#0F172A", fontWeight: "600" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
    marginTop: 6,
    paddingLeft: 4,
  },
  specialtyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  specItem: {
    alignItems: "center",
    width: (width - 2 * PADDING - 24) / 4,
  },
  specIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    elevation: 2,
  },
  specText: { fontSize: 12, color: "#0F172A" },
  doctorCard: {
    width: 280,
    backgroundColor: "#FFFFFF",
    marginRight: 12,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    elevation: 2,
    alignItems: "center",
  },
  doctorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#EEE",
  },
  doctorName: { fontWeight: "700", fontSize: 15, color: "#0F172A" },
  doctorSpec: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingText: { marginLeft: 6, color: "#0F172A", fontWeight: "700" },
  blogSection: {},
  blogCard: {
    width: 220,
    marginRight: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  blogThumb: {
    height: 90,
    borderRadius: 8,
    backgroundColor: "#E6F7F0",
    marginBottom: 8,
  },
  blogTitle: { fontWeight: "700", fontSize: 14 },
  blogExcerpt: { color: "#6B7280", marginTop: 6, fontSize: 12 },
  bottomNav: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 6,
    paddingHorizontal: 8,
  },
  navItem: { alignItems: "center", justifyContent: "center" },
  navText: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  navTextActive: { fontSize: 12, color: "#0F172A", marginTop: 2 },
})

export default UserScreen
