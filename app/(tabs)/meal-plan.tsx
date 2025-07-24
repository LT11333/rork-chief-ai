import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, Plus, ShoppingBag, Calendar as CalendarIcon, Info } from "lucide-react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";
import { useMealPlanStore, MealPlanDay } from "@/store/mealPlanStore";
import { useRecipesStore } from "@/store/recipesStore";
import { mockRecipes } from "@/mocks/recipes";
import MealPlanCard from "@/components/MealPlanCard";
import MealPlanModal from "@/components/MealPlanModal";
import { useShoppingListStore } from "@/store/shoppingListStore";
import CalendarStrip from "@/components/CalendarStrip";
import NutritionBar from "@/components/NutritionBar";
import ProgressCircle from "@/components/ProgressCircle";

// Define a type for the recipe card props
interface RecipeCardData {
  id: string;
  name: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  calories: number;
  difficulty: string;
  tags: string[];
}

export default function MealPlanScreen() {
  const router = useRouter();
  const { mealPlan, setMealForDay } = useMealPlanStore();
  const { recipes } = useRecipesStore();
  const { addMultipleItems } = useShoppingListStore();
  
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(formatDate(new Date()));
  const [selectedMealType, setSelectedMealType] = useState("");
  const [showMealModal, setShowMealModal] = useState(false);
  
  // Daily nutrition goals and consumed values
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: {
      consumed: 1450,
      goal: 2000
    },
    protein: 85,
    carbs: 160,
    fat: 50
  });

  // Generate dates for the current week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Get meal plan for the selected day
  const getDayMealPlan = (date: Date): MealPlanDay => {
    const formattedDate = formatDate(date);
    return mealPlan.find(day => day.date === formattedDate) || { 
      date: formattedDate,
      breakfast: undefined,
      lunch: undefined,
      dinner: undefined,
      snacks: []
    };
  };

  const selectedDayPlan = getDayMealPlan(new Date(selectedDay));
  
  useEffect(() => {
    // Update selected day when selected date changes
    setSelectedDay(formatDate(selectedDate));
    
    // Simulate fetching nutrition data for the selected day
    setDailyNutrition({
      calories: {
        consumed: Math.floor(Math.random() * 1500) + 500,
        goal: 2000
      },
      protein: Math.floor(Math.random() * 100) + 20,
      carbs: Math.floor(Math.random() * 150) + 50,
      fat: Math.floor(Math.random() * 50) + 15
    });
  }, [selectedDate]);

  // Handle week navigation
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  // Format date to YYYY-MM-DD
  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Get start of week (Sunday)
  function getStartOfWeek(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();
    result.setDate(result.getDate() - day);
    return result;
  }

  // Handle meal selection
  const handleMealSelect = (mealType: string) => {
    setSelectedMealType(mealType);
    setShowMealModal(true);
  };

  const handleMealAssign = (recipeId: string) => {
    setMealForDay(selectedDay, selectedMealType, recipeId);
    setShowMealModal(false);
  };

  // Get recipe by ID
  const getRecipe = (id: string | undefined): RecipeCardData | null => {
    if (!id) return null;
    const recipe = mockRecipes.find(recipe => recipe.id === id);
    if (!recipe) return null;
    
    return {
      id: recipe.id,
      name: recipe.name,
      imageUrl: recipe.imageUrl,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      calories: recipe.calories,
      difficulty: recipe.difficulty,
      tags: recipe.tags
    };
  };

  // Generate shopping list for the week
  const generateShoppingList = () => {
    // Collect all recipe IDs from the meal plan for the current week
    const recipeIds = weekDates.flatMap(date => {
      const dayPlan = getDayMealPlan(date);
      return [
        dayPlan.breakfast,
        dayPlan.lunch,
        dayPlan.dinner,
        ...(dayPlan.snacks || [])
      ].filter(Boolean) as string[];
    });
    
    // Get unique recipe IDs
    const uniqueRecipeIds = [...new Set(recipeIds)];
    
    // Get all ingredients from these recipes
    const shoppingItems = uniqueRecipeIds.flatMap(recipeId => {
      const recipe = mockRecipes.find(r => r.id === recipeId);
      if (!recipe) return [];
      
      return recipe.ingredients.map(ingredient => ({
        id: `${recipeId}-${ingredient.id}`,
        name: ingredient.name,
        quantity: 1,
        unit: ingredient.amount.split(' ').slice(-1)[0],
        category: 'grocery',
        checked: false,
        recipeId: recipeId
      }));
    });
    
    // Add to shopping list
    addMultipleItems(shoppingItems);
    
    // Navigate to shopping list
    router.push("/shopping-list");
  };
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Meal Plan</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => alert("Calendar view coming soon!")}>
            <CalendarIcon size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.shoppingButton}
            onPress={generateShoppingList}
          >
            <ShoppingBag size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar Strip */}
      <CalendarStrip 
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        startDate={currentWeekStart}
      />
      
      {/* Daily Nutrition Summary */}
      <View style={styles.nutritionSummary}>
        <View style={styles.calorieProgress}>
          <ProgressCircle 
            progress={dailyNutrition.calories.consumed / dailyNutrition.calories.goal}
            size={70}
            strokeWidth={8}
            value={dailyNutrition.calories.consumed}
            unit="kcal"
          />
          <View style={styles.calorieInfo}>
            <Text style={styles.calorieLabel}>Daily Goal</Text>
            <Text style={styles.calorieValue}>{dailyNutrition.calories.goal} kcal</Text>
            <Text style={styles.calorieRemaining}>
              {dailyNutrition.calories.goal - dailyNutrition.calories.consumed} kcal remaining
            </Text>
          </View>
        </View>
        
        <View style={styles.macroSummary}>
          <NutritionBar 
            protein={dailyNutrition.protein}
            carbs={dailyNutrition.carbs}
            fat={dailyNutrition.fat}
            height={8}
            showValues={true}
          />
        </View>
      </View>

      <ScrollView style={styles.mealsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mealSection}>
          <Text style={styles.mealTypeTitle}>Breakfast</Text>
          {selectedDayPlan.breakfast ? (
            <MealPlanCard
              recipe={getRecipe(selectedDayPlan.breakfast)}
              onPress={() => router.push(`/recipe/${selectedDayPlan.breakfast}`)}
              onLongPress={() => handleMealSelect('breakfast')}
            />
          ) : (
            <TouchableOpacity
              style={styles.addMealButton}
              onPress={() => handleMealSelect('breakfast')}
            >
              <Plus size={24} color={Colors.primary} />
              <Text style={styles.addMealText}>Add Breakfast</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.mealSection}>
          <Text style={styles.mealTypeTitle}>Lunch</Text>
          {selectedDayPlan.lunch ? (
            <MealPlanCard
              recipe={getRecipe(selectedDayPlan.lunch)}
              onPress={() => router.push(`/recipe/${selectedDayPlan.lunch}`)}
              onLongPress={() => handleMealSelect('lunch')}
            />
          ) : (
            <TouchableOpacity
              style={styles.addMealButton}
              onPress={() => handleMealSelect('lunch')}
            >
              <Plus size={24} color={Colors.primary} />
              <Text style={styles.addMealText}>Add Lunch</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.mealSection}>
          <Text style={styles.mealTypeTitle}>Dinner</Text>
          {selectedDayPlan.dinner ? (
            <MealPlanCard
              recipe={getRecipe(selectedDayPlan.dinner)}
              onPress={() => router.push(`/recipe/${selectedDayPlan.dinner}`)}
              onLongPress={() => handleMealSelect('dinner')}
            />
          ) : (
            <TouchableOpacity
              style={styles.addMealButton}
              onPress={() => handleMealSelect('dinner')}
            >
              <Plus size={24} color={Colors.primary} />
              <Text style={styles.addMealText}>Add Dinner</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.mealSection}>
          <Text style={styles.mealTypeTitle}>Snacks</Text>
          {selectedDayPlan.snacks && selectedDayPlan.snacks.length > 0 ? (
            selectedDayPlan.snacks.map((snackId: string) => (
              <MealPlanCard
                key={snackId}
                recipe={getRecipe(snackId)}
                onPress={() => router.push(`/recipe/${snackId}`)}
                onLongPress={() => handleMealSelect('snacks')}
                style={{ marginBottom: 12 }}
              />
            ))
          ) : null}
          <TouchableOpacity
            style={styles.addMealButton}
            onPress={() => handleMealSelect('snacks')}
          >
            <Plus size={24} color={Colors.primary} />
            <Text style={styles.addMealText}>Add Snack</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekPlanningCard}>
          <View style={styles.weekPlanningIcon}>
            <Info size={20} color={Colors.primary} />
          </View>
          <View style={styles.weekPlanningContent}>
            <Text style={styles.weekPlanningTitle}>Weekly Meal Planning</Text>
            <Text style={styles.weekPlanningText}>
              Plan your meals for the entire week to save time and stay on track with your nutrition goals.
            </Text>
            <TouchableOpacity style={styles.weekPlanningButton}>
              <Text style={styles.weekPlanningButtonText}>Auto-Generate Weekly Plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <MealPlanModal
        visible={showMealModal}
        onClose={() => setShowMealModal(false)}
        onSelect={handleMealAssign}
        mealType={selectedMealType}
      />
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  shoppingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  nutritionSummary: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  calorieProgress: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  calorieInfo: {
    marginLeft: 16,
    flex: 1,
  },
  calorieLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  calorieValue: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  calorieRemaining: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  macroSummary: {
    marginTop: 8,
  },
  mealsContainer: {
    flex: 1,
    padding: 16,
  },
  mealSection: {
    marginBottom: 24,
  },
  mealTypeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  addMealButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  addMealText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.primary,
    marginLeft: 8,
  },
  weekPlanningCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    marginBottom: 32,
  },
  weekPlanningIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  weekPlanningContent: {
    flex: 1,
  },
  weekPlanningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  weekPlanningText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  weekPlanningButton: {
    backgroundColor: Colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  weekPlanningButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primaryDark,
  },
});