import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight, Plus, Search, Zap } from "lucide-react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";
import { useUserStore } from "@/store/userStore";
import { useIngredientsStore } from "@/store/ingredientsStore";
import { useRecipesStore } from "@/store/recipesStore";
import { mockRecipes } from "@/mocks/recipes";
import RecipeCard from "@/components/RecipeCard";
import IngredientsList from "@/components/IngredientsList";
import ProgressCircle from "@/components/ProgressCircle";
import NutritionBar from "@/components/NutritionBar";
import CalendarStrip from "@/components/CalendarStrip";
import AiChatButton from "@/components/AiChatButton";
import SubscriptionBanner from "@/components/SubscriptionBanner";

export default function HomeScreen() {
  const router = useRouter();
  const { preferences } = useUserStore();
  const { ingredients } = useIngredientsStore();
  const { recentlyViewed, favoriteRecipes } = useRecipesStore();
  const [refreshing, setRefreshing] = useState(false);
  const [recommendedRecipes, setRecommendedRecipes] = useState<typeof mockRecipes>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Daily nutrition goals (would come from user preferences in a real app)
  const dailyGoals = {
    calories: 2000,
    protein: 120,
    carbs: 200,
    fat: 65,
  };
  
  // Simulated consumed nutrition for the day
  const [consumed, setConsumed] = useState({
    calories: 1250,
    protein: 75,
    carbs: 130,
    fat: 40,
  });

  useEffect(() => {
    // In a real app, this would be an API call based on user preferences and ingredients
    // For now, we'll just filter the mock recipes
    const filtered = mockRecipes
      .filter(recipe => {
        // Filter by dietary restrictions
        if (preferences.dietaryRestrictions.length > 0) {
          const matchesDiet = preferences.dietaryRestrictions.every(restriction => 
            recipe.dietaryRestrictions.includes(restriction)
          );
          if (!matchesDiet) return false;
        }
        
        // Filter by cooking time preference
        if (preferences.cookingTime === "quick" && (recipe.prepTime + recipe.cookTime) > 15) {
          return false;
        } else if (preferences.cookingTime === "medium" && (recipe.prepTime + recipe.cookTime) > 30) {
          return false;
        }
        
        return true;
      })
      .slice(0, 5); // Just take the first 5 for recommendations
      
    setRecommendedRecipes(filtered);
  }, [preferences, ingredients]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      // Update consumed nutrition for demo purposes
      setConsumed({
        calories: Math.floor(Math.random() * 1500) + 500,
        protein: Math.floor(Math.random() * 100) + 20,
        carbs: Math.floor(Math.random() * 150) + 50,
        fat: Math.floor(Math.random() * 50) + 15,
      });
      setRefreshing(false);
    }, 1000);
  };

  const getRecentlyViewedRecipes = () => {
    return recentlyViewed
      .map(id => mockRecipes.find(recipe => recipe.id === id))
      .filter(Boolean);
  };

  const getFavoriteRecipes = () => {
    return favoriteRecipes
      .map(id => mockRecipes.find(recipe => recipe.id === id))
      .filter(Boolean);
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getGoalMessage = () => {
    switch (preferences.goal) {
      case "weight-loss":
        return "Focus on low-calorie, nutrient-dense meals today";
      case "muscle-gain":
        return "Aim for protein-rich meals to support your muscle growth";
      case "maintenance":
        return "Balanced nutrition keeps you on track";
      case "healthy-eating":
        return "Fresh, whole foods make for the best meals";
      case "use-ingredients":
        return "Let's make the most of what you have";
      default:
        return "What would you like to cook today?";
    }
  };
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // In a real app, you would fetch nutrition data for the selected date
  };
  
  const handleSubscriptionPress = () => {
    // Navigate to subscription screen or show subscription modal
    alert("Subscription features coming soon!");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getWelcomeMessage()}</Text>
            <Text style={styles.goalMessage}>{getGoalMessage()}</Text>
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => router.push("/recipes")}
          >
            <Search size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
        
        {/* Calendar Strip */}
        <CalendarStrip 
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
        
        {/* Daily Nutrition Summary */}
        <View style={styles.nutritionCard}>
          <View style={styles.nutritionHeader}>
            <Text style={styles.nutritionTitle}>Today's Nutrition</Text>
            <TouchableOpacity style={styles.nutritionAction}>
              <Text style={styles.nutritionActionText}>Details</Text>
              <ChevronRight size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.nutritionContent}>
            <ProgressCircle 
              progress={consumed.calories / dailyGoals.calories}
              size={90}
              strokeWidth={10}
              value={consumed.calories}
              unit="kcal"
              label="Calories"
            />
            
            <View style={styles.macrosContainer}>
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Remaining</Text>
                <Text style={styles.macroValue}>
                  {dailyGoals.calories - consumed.calories} kcal
                </Text>
              </View>
              
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Goal</Text>
                <Text style={styles.macroValue}>{dailyGoals.calories} kcal</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.nutritionBarContainer}>
            <NutritionBar 
              protein={consumed.protein}
              carbs={consumed.carbs}
              fat={consumed.fat}
            />
          </View>
        </View>
        
        {/* Subscription Banner */}
        <SubscriptionBanner onPress={handleSubscriptionPress} />

        {ingredients.length > 0 ? (
          <View style={globalStyles.section}>
            <View style={[globalStyles.row, globalStyles.spaceBetween, { paddingHorizontal: 16 }]}>
              <Text style={globalStyles.sectionTitle}>Your Ingredients</Text>
              <TouchableOpacity onPress={() => router.push("/ingredients")}>
                <Text style={styles.seeAllText}>Manage</Text>
              </TouchableOpacity>
            </View>
            <IngredientsList 
              ingredients={ingredients.slice(0, 8)} 
              horizontal={true}
              onPress={() => router.push("/ingredients")}
            />
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.addIngredientsCard}
            onPress={() => router.push("/scan")}
          >
            <View style={styles.addIngredientsContent}>
              <View style={styles.addIconContainer}>
                <Plus size={24} color={Colors.white} />
              </View>
              <View style={styles.addTextContainer}>
                <Text style={styles.addIngredientsTitle}>Add your ingredients</Text>
                <Text style={styles.addIngredientsSubtitle}>
                  Scan your fridge or add ingredients manually
                </Text>
              </View>
              <ChevronRight size={20} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        )}

        <View style={globalStyles.section}>
          <View style={[globalStyles.row, globalStyles.spaceBetween, { paddingHorizontal: 16 }]}>
            <Text style={globalStyles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity onPress={() => router.push("/recipes")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {recommendedRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                style={styles.horizontalRecipeCard}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        {getRecentlyViewedRecipes().length > 0 && (
          <View style={globalStyles.section}>
            <Text style={globalStyles.sectionTitle}>Recently Viewed</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {getRecentlyViewedRecipes().map((recipe) => (
                recipe && (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    style={styles.horizontalRecipeCard}
                    onPress={() => router.push(`/recipe/${recipe.id}`)}
                  />
                )
              ))}
            </ScrollView>
          </View>
        )}

        {getFavoriteRecipes().length > 0 && (
          <View style={globalStyles.section}>
            <Text style={globalStyles.sectionTitle}>Your Favorites</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {getFavoriteRecipes().map((recipe) => (
                recipe && (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    style={styles.horizontalRecipeCard}
                    onPress={() => router.push(`/recipe/${recipe.id}`)}
                  />
                )
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.tipContainer}>
          <View style={styles.tipIconContainer}>
            <Zap size={20} color={Colors.primary} />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Nutrition Tip</Text>
            <Text style={styles.tipText}>
              Meal prep on weekends can save you time and help you stick to your {preferences.goal.replace('-', ' ')} goals.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* AI Chat Button */}
      <AiChatButton />
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
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  goalMessage: {
    fontSize: 16,
    color: Colors.textLight,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
  },
  nutritionCard: {
    margin: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  nutritionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  nutritionAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  nutritionActionText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  nutritionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  macrosContainer: {
    flex: 1,
    marginLeft: 16,
  },
  macroItem: {
    marginBottom: 12,
  },
  macroLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  nutritionBarContainer: {
    marginTop: 8,
  },
  addIngredientsCard: {
    margin: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addIngredientsContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  addIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  addTextContainer: {
    flex: 1,
  },
  addIngredientsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  addIngredientsSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
  },
  horizontalScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  horizontalRecipeCard: {
    width: 200,
    marginRight: 16,
  },
  tipContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});