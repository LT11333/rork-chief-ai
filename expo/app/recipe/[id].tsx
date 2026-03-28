import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Heart, Clock, ChevronLeft, Share2, Plus, Check } from "lucide-react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";
import { mockRecipes } from "@/mocks/recipes";
import { useRecipesStore } from "@/store/recipesStore";
import { useIngredientsStore } from "@/store/ingredientsStore";
import { useShoppingListStore } from "@/store/shoppingListStore";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToFavorites, removeFromFavorites, favoriteRecipes, addToRecentlyViewed } = useRecipesStore();
  const { ingredients } = useIngredientsStore();
  const { addMultipleItems } = useShoppingListStore();
  
  const [recipe, setRecipe] = useState(mockRecipes.find(r => r.id === id));
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id && typeof id === "string") {
      const foundRecipe = mockRecipes.find(r => r.id === id);
      if (foundRecipe) {
        setRecipe(foundRecipe);
        addToRecentlyViewed(id);
        setIsFavorite(favoriteRecipes.includes(id));
      }
    }
  }, [id, favoriteRecipes]);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Recipe not found</Text>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => router.back()}
        >
          <Text style={globalStyles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe.id);
    }
    setIsFavorite(!isFavorite);
  };

  const shareRecipe = async () => {
    try {
      await Share.share({
        message: `Check out this recipe for ${recipe.name}! It takes ${recipe.prepTime + recipe.cookTime} minutes to make and has ${recipe.calories} calories.`,
        title: recipe.name,
      });
    } catch (error) {
      console.error("Error sharing recipe:", error);
    }
  };

  const addMissingToShoppingList = () => {
    // Find ingredients that the user doesn't have
    const userIngredientNames = ingredients.map(i => i.name.toLowerCase());
    
    const missingIngredients = recipe.ingredients.filter(ingredient => 
      !userIngredientNames.some(name => 
        ingredient.name.toLowerCase().includes(name) || 
        name.includes(ingredient.name.toLowerCase())
      )
    );
    
    // Add to shopping list
    addMultipleItems(missingIngredients.map(ingredient => ({
      id: `${recipe.id}-${ingredient.id}`,
      name: ingredient.name,
      quantity: 1,
      unit: ingredient.amount.split(' ').slice(-1)[0],
      category: 'grocery',
      checked: false,
      recipeId: recipe.id
    })));
    
    // Show confirmation
    alert(`Added ${missingIngredients.length} items to your shopping list`);
  };

  // Check which ingredients the user has
  const checkIngredientAvailability = () => {
    if (ingredients.length === 0) return recipe.ingredients;
    
    const userIngredientNames = ingredients.map(i => i.name.toLowerCase());
    
    return recipe.ingredients.map(ingredient => ({
      ...ingredient,
      available: userIngredientNames.some(name => 
        ingredient.name.toLowerCase().includes(name) || 
        name.includes(ingredient.name.toLowerCase())
      )
    }));
  };

  const availableIngredients = checkIngredientAvailability();
  const missingIngredientsCount = availableIngredients.filter(i => !i.available).length;

  return (
    <>
      <StatusBar style="light" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
          <View style={styles.overlay} />
          <SafeAreaView style={styles.header} edges={["top"]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={shareRecipe}
              >
                <Share2 size={20} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={toggleFavorite}
              >
                <Heart
                  size={20}
                  color={Colors.white}
                  fill={isFavorite ? Colors.secondary : "none"}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.name}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={16} color={Colors.textLight} />
              <Text style={styles.metaText}>
                {recipe.prepTime + recipe.cookTime} min
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{recipe.calories} cal</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{recipe.difficulty}</Text>
            </View>
          </View>
          
          <View style={styles.tagsContainer}>
            {recipe.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.description}>{recipe.description}</Text>
          
          <View style={styles.nutritionContainer}>
            <Text style={styles.sectionTitle}>Nutrition</Text>
            <View style={styles.nutritionItems}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.calories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.protein}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.carbs}g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.fat}g</Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <Text style={styles.servingsText}>
                {recipe.servings} servings
              </Text>
            </View>
            
            {missingIngredientsCount > 0 && (
              <TouchableOpacity
                style={styles.addToShoppingButton}
                onPress={addMissingToShoppingList}
              >
                <Plus size={16} color={Colors.primary} />
                <Text style={styles.addToShoppingText}>
                  Add {missingIngredientsCount} missing ingredients to shopping list
                </Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.ingredientsList}>
              {availableIngredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  {ingredient.available ? (
                    <View style={styles.availableIndicator}>
                      <Check size={16} color={Colors.success} />
                    </View>
                  ) : (
                    <View style={styles.unavailableIndicator} />
                  )}
                  <View style={styles.ingredientInfo}>
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                    <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.instructionsList}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageContainer: {
    height: 300,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: "500",
  },
  description: {
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 24,
    marginBottom: 24,
  },
  nutritionContainer: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  nutritionItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  nutritionItem: {
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  servingsText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  addToShoppingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  addToShoppingText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
    marginLeft: 8,
  },
  ingredientsList: {
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  availableIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  unavailableIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 12,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  ingredientAmount: {
    fontSize: 14,
    color: Colors.textLight,
  },
  instructionsList: {
    marginTop: 8,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.white,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    color: Colors.error,
    textAlign: "center",
    marginBottom: 16,
  },
});