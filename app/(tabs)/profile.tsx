import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight, Settings, Bell, Heart, ShoppingBag, LogOut, Star, Moon, Share2, HelpCircle } from "lucide-react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";
import { useUserStore } from "@/store/userStore";
import SubscriptionBanner from "@/components/SubscriptionBanner";
import ProgressCircle from "@/components/ProgressCircle";

type DietaryLabels = {
  "none": string;
  "vegetarian": string;
  "vegan": string;
  "gluten-free": string;
  "dairy-free": string;
  "keto": string;
  "paleo": string;
  [key: string]: string; // Index signature for string keys
};

type GoalLabels = {
  "weight-loss": string;
  "muscle-gain": string;
  "maintenance": string;
  "healthy-eating": string;
  "use-ingredients": string;
  [key: string]: string; // Index signature for string keys
};

type CookingTimeLabels = {
  "quick": string;
  "medium": string;
  "long": string;
  [key: string]: string; // Index signature for string keys
};

const dietaryLabels: DietaryLabels = {
  "none": "No restrictions",
  "vegetarian": "Vegetarian",
  "vegan": "Vegan",
  "gluten-free": "Gluten-free",
  "dairy-free": "Dairy-free",
  "keto": "Keto",
  "paleo": "Paleo",
};

const goalLabels: GoalLabels = {
  "weight-loss": "Weight Loss",
  "muscle-gain": "Muscle Gain",
  "maintenance": "Maintain Weight",
  "healthy-eating": "Healthy Eating",
  "use-ingredients": "Just Use Ingredients",
};

const cookingTimeLabels: CookingTimeLabels = {
  "quick": "Quick (< 15 min)",
  "medium": "Medium (15-30 min)",
  "long": "I enjoy cooking (30+ min)",
};

export default function ProfileScreen() {
  const router = useRouter();
  const { preferences, setUserPreferences, resetPreferences } = useUserStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
  const handleResetPreferences = () => {
    Alert.alert(
      "Reset Preferences",
      "Are you sure you want to reset all your preferences? This will restart the onboarding process.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetPreferences();
            router.replace("/onboarding");
          }
        }
      ]
    );
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  const toggleDarkMode = () => {
    setDarkModeEnabled(!darkModeEnabled);
  };
  
  const handleSubscriptionPress = () => {
    // Navigate to subscription screen or show subscription modal
    alert("Subscription features coming soon!");
  };
  
  const handleShareApp = () => {
    alert("Share functionality coming soon!");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity>
            <Settings size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop" }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Chief AI User</Text>
            <Text style={styles.profileEmail}>user@example.com</Text>
            <SubscriptionBanner onPress={handleSubscriptionPress} compact={true} />
          </View>
        </View>
        
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <ProgressCircle 
              size={70}
              strokeWidth={8}
              progress={0.7}
              value={7}
              label="Days"
            />
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          
          <View style={styles.statItem}>
            <ProgressCircle 
              size={70}
              strokeWidth={8}
              progress={0.4}
              value={12}
              label="Recipes"
              color={Colors.secondary}
            />
            <Text style={styles.statLabel}>Cooked</Text>
          </View>
          
          <View style={styles.statItem}>
            <ProgressCircle 
              size={70}
              strokeWidth={8}
              progress={0.6}
              value={8}
              label="Items"
              color={Colors.accent}
            />
            <Text style={styles.statLabel}>Ingredients</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Preferences</Text>
          
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Goal</Text>
            <Text style={styles.preferenceValue}>
              {goalLabels[preferences.goal as keyof GoalLabels] || "Not set"}
            </Text>
          </View>
          
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Dietary Restrictions</Text>
            <Text style={styles.preferenceValue}>
              {preferences.dietaryRestrictions.length > 0 
                ? preferences.dietaryRestrictions.map(r => dietaryLabels[r as keyof DietaryLabels]).join(", ")
                : "None"}
            </Text>
          </View>
          
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Cooking Time</Text>
            <Text style={styles.preferenceValue}>
              {cookingTimeLabels[preferences.cookingTime as keyof CookingTimeLabels] || "Not set"}
            </Text>
          </View>
          
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Flavor Preferences</Text>
            <Text style={styles.preferenceValue}>
              {preferences.flavorPreferences.length > 0 
                ? preferences.flavorPreferences.join(", ")
                : "None"}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push("/onboarding")}
          >
            <Text style={styles.editButtonText}>Edit Preferences</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/shopping-list")}>
            <View style={styles.menuItemLeft}>
              <ShoppingBag size={20} color={Colors.text} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Shopping List</Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/ingredients")}>
            <View style={styles.menuItemLeft}>
              <Heart size={20} color={Colors.text} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>My Ingredients</Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Bell size={20} color={Colors.text} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={notificationsEnabled ? Colors.primary : Colors.textExtraLight}
            />
          </View>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Moon size={20} color={Colors.text} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={toggleDarkMode}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={darkModeEnabled ? Colors.primary : Colors.textExtraLight}
            />
          </View>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleSubscriptionPress}>
            <View style={styles.menuItemLeft}>
              <Star size={20} color={Colors.premium} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Upgrade to Pro</Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleShareApp}>
            <View style={styles.menuItemLeft}>
              <Share2 size={20} color={Colors.text} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Share Chief AI</Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <HelpCircle size={20} color={Colors.text} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.dangerButton}
          onPress={handleResetPreferences}
        >
          <LogOut size={20} color={Colors.error} style={styles.menuItemIcon} />
          <Text style={styles.dangerButtonText}>Reset All Preferences</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Chief AI v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2023 Chief AI. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  preferenceLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  preferenceValue: {
    fontSize: 16,
    color: Colors.textLight,
    maxWidth: "60%",
    textAlign: "right",
  },
  editButton: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 16,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primaryDark,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.error,
  },
  footer: {
    alignItems: "center",
    marginTop: 48,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: Colors.textExtraLight,
  },
});