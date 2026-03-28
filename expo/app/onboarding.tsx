import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";
import { useUserStore } from "@/store/userStore";

const dietaryOptions = [
  { id: "none", label: "No restrictions" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-free" },
  { id: "dairy-free", label: "Dairy-free" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
];

const goalOptions = [
  { id: "weight-loss", label: "Weight Loss", icon: "🏃‍♂️" },
  { id: "muscle-gain", label: "Muscle Gain", icon: "💪" },
  { id: "maintenance", label: "Maintain Weight", icon: "⚖️" },
  { id: "healthy-eating", label: "Healthy Eating", icon: "🥗" },
  { id: "use-ingredients", label: "Just Use Ingredients", icon: "🍽️" },
];

const cookingTimeOptions = [
  { id: "quick", label: "Quick (< 15 min)" },
  { id: "medium", label: "Medium (15-30 min)" },
  { id: "long", label: "I enjoy cooking (30+ min)" },
];

const flavorOptions = [
  { id: "spicy", label: "Spicy 🌶️" },
  { id: "sweet", label: "Sweet 🍯" },
  { id: "savory", label: "Savory 🧀" },
  { id: "sour", label: "Sour 🍋" },
  { id: "bitter", label: "Bitter ☕" },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setUserPreferences } = useUserStore();
  
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [cookingTime, setCookingTime] = useState("");
  const [flavorPreferences, setFlavorPreferences] = useState<string[]>([]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save preferences and navigate to main app
      setUserPreferences({
        goal,
        dietaryRestrictions,
        cookingTime,
        flavorPreferences,
        onboardingCompleted: true,
      });
      
      // Use push instead of replace to avoid navigation issues
      router.push("/(tabs)");
    }
  };

  const toggleDietaryRestriction = (id: string) => {
    if (dietaryRestrictions.includes(id)) {
      setDietaryRestrictions(dietaryRestrictions.filter(item => item !== id));
    } else {
      setDietaryRestrictions([...dietaryRestrictions, id]);
    }
  };

  const toggleFlavorPreference = (id: string) => {
    if (flavorPreferences.includes(id)) {
      setFlavorPreferences(flavorPreferences.filter(item => item !== id));
    } else {
      setFlavorPreferences([...flavorPreferences, id]);
    }
  };

  const isNextDisabled = () => {
    if (step === 0 && !goal) return true;
    if (step === 2 && !cookingTime) return true;
    return false;
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What is your goal?</Text>
            <Text style={styles.stepDescription}>
              We'll personalize your recipe recommendations based on your goal
            </Text>
            <View style={styles.optionsContainer}>
              {goalOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.goalOption,
                    goal === option.id && styles.selectedOption,
                  ]}
                  onPress={() => setGoal(option.id)}
                >
                  <Text style={styles.goalIcon}>{option.icon}</Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      goal === option.id && styles.selectedOptionLabel,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Any dietary restrictions?</Text>
            <Text style={styles.stepDescription}>
              Select all that apply to you
            </Text>
            <View style={styles.optionsContainer}>
              {dietaryOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.option,
                    dietaryRestrictions.includes(option.id) && styles.selectedOption,
                  ]}
                  onPress={() => toggleDietaryRestriction(option.id)}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      dietaryRestrictions.includes(option.id) && styles.selectedOptionLabel,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>How much time do you have for cooking?</Text>
            <Text style={styles.stepDescription}>
              We'll suggest recipes that fit your schedule
            </Text>
            <View style={styles.optionsContainer}>
              {cookingTimeOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.option,
                    cookingTime === option.id && styles.selectedOption,
                  ]}
                  onPress={() => setCookingTime(option.id)}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      cookingTime === option.id && styles.selectedOptionLabel,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What flavors do you prefer?</Text>
            <Text style={styles.stepDescription}>
              Select all that you enjoy
            </Text>
            <View style={styles.optionsContainer}>
              {flavorOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.option,
                    flavorPreferences.includes(option.id) && styles.selectedOption,
                  ]}
                  onPress={() => toggleFlavorPreference(option.id)}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      flavorPreferences.includes(option.id) && styles.selectedOptionLabel,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=2070&auto=format&fit=crop" }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <Text style={styles.title}>Chief AI</Text>
          <Text style={styles.subtitle}>Your smart cooking assistant</Text>
        </View>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i === step && styles.activeProgressDot,
                i < step && styles.completedProgressDot,
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity
          style={[globalStyles.button, isNextDisabled() && styles.disabledButton]}
          onPress={handleNext}
          disabled={isNextDisabled()}
        >
          <View style={globalStyles.row}>
            <Text style={globalStyles.buttonText}>
              {step < 3 ? "Continue" : "Get Started"}
            </Text>
            <ChevronRight color={Colors.white} size={20} style={{ marginLeft: 8 }} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 220,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  headerContent: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    paddingVertical: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 24,
  },
  optionsContainer: {
    marginTop: 8,
  },
  option: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  goalOption: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  goalIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  selectedOption: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
  selectedOptionLabel: {
    color: Colors.primaryDark,
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  activeProgressDot: {
    backgroundColor: Colors.primary,
    width: 20,
  },
  completedProgressDot: {
    backgroundColor: Colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
});