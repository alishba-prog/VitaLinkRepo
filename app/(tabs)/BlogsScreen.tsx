// import { useEffect, useState } from "react";
// import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// const GNEWS_API_KEY = "6c6e510aec18318676bbe35aa8be1d1d";  // register on gnews.io


// export default function BlogsScreen() {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const res = await fetch(
//           `https://gnews.io/api/v4/top-headlines?country=pk&category=health&apikey=${GNEWS_API_KEY}`
//         );
//         const json = await res.json();
//         console.log("GNews response:", json);  // 👈 Add this line
//         // json.articles is an array
//         // Map to your internal shape
//         const mapped = (json.articles || []).map((item, idx) => ({
//           id: item.url || `gnews_${idx}`,
//           title: item.title,
//           excerpt: item.description || "",
//           image: item.image,  // may be null
//           content: item.content || item.description || "",
//           source: item.source?.name,
//         }));
//         setBlogs(mapped);
//       } catch (err) {
//         console.error("Error fetching GNews:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   if (loading) {
//     return (
//       <View style={[styles.loadingContainer]}>
//         <ActivityIndicator size="large" color="#0F172A" />
//         <Text>Loading health news...</Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={blogs}
//       keyExtractor={(item) => item.id}
//       renderItem={({ item }) => (
//         <TouchableOpacity style={styles.card}>
//           {item.image ? (
//             <Image source={{ uri: item.image }} style={styles.image} />
//           ) : null}
//           <View style={styles.textContainer}>
//             <Text style={styles.title}>{item.title}</Text>
//             <Text style={styles.excerpt} numberOfLines={2}>
//               {item.excerpt}
//             </Text>
//           </View>
//         </TouchableOpacity>
//       )}
//       contentContainerStyle={{ padding: 16 }}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   card: { marginBottom: 16, backgroundColor: "#fff", borderRadius: 8, overflow: "hidden", elevation: 2 },
//   image: { width: "100%", height: 180 },
//   textContainer: { padding: 12 },
//   title: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
//   excerpt: { fontSize: 14, color: "#555" },
// });




// app/BlogsScreen.js


// import { useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// const NEWSDATA_API_KEY = "pub_ea757eba630d4d35873fd7ab7fa83f0e";

// export default function BlogsScreen() {
//   const router = useRouter();
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [nextPage, setNextPage] = useState(null);
  

//   const fetchBlogs = async (page = null) => {
//     try {
//       const url = `https://newsdata.io/api/1/news?country=pk&category=health&apikey=${NEWSDATA_API_KEY}&language=en${page ? `&page=${page}` : ""}`;
//       const res = await fetch(url);
//       const json = await res.json();
//       // console.log("NewsData response:", json);

//       if (!json.results) throw new Error(json.message || "No results from NewsData");

//       const mapped = json.results.map((item, idx) => ({
//         id: item.link || `newsdata_${idx}_${page || 1}`,
//         title: item.title,
//         excerpt: item.description || "",
//         image: item.image_url,
//         content: item.content || item.description || "",
//         source: item.source_id,
//         url: item.link,
//       }));

//       setBlogs(prev => page ? [...prev, ...mapped] : mapped);
//       setNextPage(json.nextPage || null);
//     } catch (err) {
//       console.error("Error fetching NewsData:", err);
//       setError(err.message || "Fetch failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchBlogs(); }, []);

//   if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading...</Text></View>;
//   if (error) return <View style={styles.center}><Text style={{ color: "red" }}>{error}</Text></View>;

//   return (
//     <FlatList
//       data={blogs}
//       keyExtractor={(item) => item.id}
//       onEndReached={() => nextPage && fetchBlogs(nextPage)}
//       onEndReachedThreshold={0.5}
//       renderItem={({ item }) => (
//         <TouchableOpacity
//           style={styles.card}
//           onPress={() => {
//             // encode the entire blog object (safe for url params)
//             const encoded = encodeURIComponent(JSON.stringify(item));
//             router.push({ pathname: "/BlogDetail", params: { blog: encoded } });
//           }}
//         >
//           {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
//           <View style={styles.textContainer}>
//             <Text style={styles.title}>{item.title}</Text>
//             <Text style={styles.excerpt} numberOfLines={2}>{item.excerpt}</Text>
//             <Text style={styles.source}>{item.source}</Text>
//           </View>
//         </TouchableOpacity>
//       )}
//       contentContainerStyle={{ padding: 16 }}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   card: { marginBottom: 16, backgroundColor: "#fff", borderRadius: 8, overflow: "hidden", elevation: 2 },
//   image: { width: "100%", height: 180 },
//   textContainer: { padding: 12 },
//   title: { fontSize: 16, fontWeight: "700" },
//   excerpt: { fontSize: 14, color: "#555" },
//   source: { fontSize: 12, color: "#999" },
// });



import { useRouter } from "expo-router"
import type React from "react"
import { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const NEWSDATA_API_KEY = "pub_ea757eba630d4d35873fd7ab7fa83f0e"

interface BlogItem {
  id: string
  title: string
  excerpt: string
  image?: string
  content: string
  source: string
  url?: string
}

interface NewsDataResponse {
  results?: any[]
  nextPage?: string
  message?: string
}

const BlogsScreen: React.FC = () => {
  const router = useRouter()
  const [blogs, setBlogs] = useState<BlogItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [nextPage, setNextPage] = useState<string | null>(null)

  const fetchBlogs = async (page: string | null = null): Promise<void> => {
    try {
      const url = `https://newsdata.io/api/1/news?country=pk&category=health&apikey=${NEWSDATA_API_KEY}&language=en${page ? `&page=${page}` : ""}`
      const res = await fetch(url)
      const json: NewsDataResponse = await res.json()

      if (!json.results) throw new Error(json.message || "No results from NewsData")

      const mapped: BlogItem[] = json.results.map((item: any, idx: number) => ({
        id: item.link || `newsdata_${idx}_${page || 1}`,
        title: item.title,
        excerpt: item.description || "",
        image: item.image_url,
        content: item.content || item.description || "",
        source: item.source_id,
        url: item.link,
      }))

      setBlogs((prev) => (page ? [...prev, ...mapped] : mapped))
      setNextPage(json.nextPage || null)
    } catch (err: any) {
      console.error("Error fetching NewsData:", err)
      setError(err.message || "Fetch failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleEndReached = (): void => {
    if (nextPage) {
      fetchBlogs(nextPage)
    }
  }

  const handleBlogPress = (item: BlogItem): void => {
    const encoded = encodeURIComponent(JSON.stringify(item))
    router.push({ pathname: "/BlogDetail", params: { blog: encoded } })
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    )
  }

  const renderItem = ({ item }: { item: BlogItem }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleBlogPress(item)}>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.excerpt} numberOfLines={2}>
          {item.excerpt}
        </Text>
        <Text style={styles.source}>{item.source}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <FlatList
      data={blogs}
      keyExtractor={(item) => item.id}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { marginBottom: 16, backgroundColor: "#fff", borderRadius: 8, overflow: "hidden", elevation: 2 },
  image: { width: "100%", height: 180 },
  textContainer: { padding: 12 },
  title: { fontSize: 16, fontWeight: "700" },
  excerpt: { fontSize: 14, color: "#555" },
  source: { fontSize: 12, color: "#999" },
})

export default BlogsScreen
