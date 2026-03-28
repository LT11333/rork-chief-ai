import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Star } from "lucide-react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";

interface SubscriptionBannerProps {
  onPress: () => void;
  compact?: boolean;
}

export default function SubscriptionBanner({ onPress, compact = false }: SubscriptionBannerProps) {
  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={onPress}
      >
        <Star size={16} color={Colors.premium} fill={Colors.premium} />
        <Text style={styles.compactText}>Upgrade to Pro</Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Star size={12} color={Colors.white} fill={Colors.white} />
            <Text style={styles.badgeText}>PRO</Text>
          </View>
        </View>
        
        <Text style={styles.title}>Upgrade to Chief AI Pro</Text>
        <Text style={styles.description}>
          Get personalized meal plans, advanced nutrition tracking, and exclusive recipes
        </Text>
        
        <View style={styles.button}>
          <Text style={styles.buttonText}>Upgrade Now</Text>
        </View>
      </View>
      
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop" }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    height: 160,
  },
  content: {
    padding: 16,
    width: "65%",
    height: "100%",
    justifyContent: "space-between",
  },
  badgeContainer: {
    flexDirection: "row",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.premium,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
    marginBottom: 12,
  },
  button: {
    backgroundColor: Colors.premium,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  image: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "40%",
    height: "100%",
  },
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  compactText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.premium,
    marginLeft: 6,
  },
});