import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import type React from "react"
import { useState } from "react"
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

interface Specialty {
  id: string
  name: string
  icon: any
}

const specialties: Specialty[] = [
  { id: "1", name: "Skin Specialist", icon: require("../../assets/icons/skin.png") },
  { id: "2", name: "Gynecologist", icon: require("../../assets/icons/gynecologist.png") },
  { id: "3", name: "Child Specialist", icon: require("../../assets/icons/child.png") },
  { id: "4", name: "Orthopedic Surgeon", icon: require("../../assets/icons/orthopedic.png") },
  { id: "5", name: "Consultant Physician", icon: require("../../assets/icons/physician.png") },
  { id: "6", name: "NTE Specialist", icon: require("../../assets/icons/ent.png") },
  { id: "7", name: "Neurologist", icon: require("../../assets/icons/neurologist.png") },
  { id: "8", name: "Eye Specialist", icon: require("../../assets/icons/eye.png") },
  { id: "9", name: "Psychiatrist", icon: require("../../assets/icons/psychiatrist.png") },
  { id: "10", name: "Dentist", icon: require("../../assets/icons/dentist.png") },
  { id: "11", name: "Gastroenterologist", icon: require("../../assets/icons/gastro.png") },
  { id: "12", name: "Heart Specialist", icon: require("../../assets/icons/heart.png") },
  { id: "13", name: "Diabetes Specialist", icon: require("../../assets/icons/diabetes.png") },
  { id: "14", name: "General Surgeon", icon: require("../../assets/icons/surgeon.png") },
]

const ConsultDoctorScreen: React.FC = () => {
  const [query, setQuery] = useState<string>("")
  const router = useRouter()

  const filteredData = specialties.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))

  const renderItem = ({ item }: { item: Specialty }) => (
    //  changed <TouchableOpacity style={styles.card} onPress={() => router.push(`/doctors/${item.id}`)}>
    <TouchableOpacity style={styles.card} >
      <Image source={item.icon} style={styles.icon} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.city}>Current city</Text>
          <Text style={styles.cityName}>Lahore</Text>
        </View>
      </View>

      <TextInput
        placeholder="Find Doctors, Specialties, Disease and Hospitals..."
        style={styles.search}
        value={query}
        onChangeText={setQuery}
      />

      {/* Body */}
      <Text style={styles.sectionTitle}>Search by specialty</Text>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FBFF", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  city: { fontSize: 14, color: "#6B7280" },
  cityName: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  search: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginVertical: 12, color: "#111827" },
  card: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    margin: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: { width: 48, height: 48, marginBottom: 8, resizeMode: "contain" },
  name: { fontSize: 14, textAlign: "center", color: "#111827" },
})

export default ConsultDoctorScreen
