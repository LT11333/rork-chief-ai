import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Camera, ImagePlus, List } from "lucide-react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";

export default function ScanTabScreen() {
  const router = useRouter();

  // Removed the automatic navigation useEffect
  // Instead, we'll let the user choose when to navigate

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <Text style={styles.title}>Scan Ingredients</Text>
        <Text style={styles.description}>
          Scan your fridge or pantry to identify ingredients
        </Text>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push("/scan")}
          >
            <View style={styles.optionIconContainer}>
              <Camera size={24} color={Colors.white} />
            </View>
            <Text style={styles.optionText}>Scan with Camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push("/scan?source=gallery")}
          >
            <View style={[styles.optionIconContainer, { backgroundColor: Colors.secondary }]}>
              <ImagePlus size={24} color={Colors.white} />
            </View>
            <Text style={styles.optionText}>Upload from Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push("/ingredients")}
          >
            <View style={[styles.optionIconContainer, { backgroundColor: Colors.success }]}>
              <List size={24} color={Colors.white} />
            </View>
            <Text style={styles.optionText}>Add Manually</Text>
          </TouchableOpacity>
        </View>
        
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=2070&auto=format&fit=crop" }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
    marginBottom: 32,
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 32,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    opacity: 0.8,
  },
});