import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, Filter, X } from "lucide-react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";
import { mockRecipes } from "@/mocks/recipes";
import RecipeCard from "@/components/RecipeCard";
import FilterModal from "@/components/FilterModal";
import { useUserStore } from "@/store/userStore";
import { useIngredientsStore } from "@/store/ingredientsStore";

interface FilterOptions {
  mealType: string[];
  difficulty: string[];
  dietaryRestrictions: string[];
  maxTime: number;
  maxCalories: number;
  useAvailableIngredients: boolean;
}

interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  calories: number;
  difficulty: string;
  tags: string[];
  mealType: string[];
  dietaryRestrictions: string[];
  ingredients: any[]; // Using any for simplicity, but should be properly typed
}

export default function RecipesScreen() {
  const router = useRouter();
  const { preferences } = useUserStore();
  const { ingredients } = useIngredientsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(mockRecipes);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    mealType: [] as string[],
    difficulty: [] as string[],
    dietaryRestrictions: [...preferences.dietaryRestrictions],
    maxTime: 0,
    maxCalories: 0,
    useAvailableIngredients: false,
  });

  useEffect(() => {
    applyFilters();
  }, [searchQuery, activeFilters]);

  const applyFilters = () => {
    let results = mockRecipes;

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        recipe =>
          recipe.name.toLowerCase().includes(query) ||
          recipe.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply meal type filter
    if (activeFilters.mealType.length > 0) {
      results = results.filter(recipe =>
        recipe.mealType.some(type => activeFilters.mealType.includes(type))
      );
    }

    // Apply difficulty filter
    if (activeFilters.difficulty.length > 0) {
      results = results.filter(recipe =>
        activeFilters.difficulty.includes(recipe.difficulty)
      );
    }

    // Apply dietary restrictions
    if (activeFilters.dietaryRestrictions.length > 0) {
      results = results.filter(recipe =>
        activeFilters.dietaryRestrictions.every(restriction =>
          recipe.dietaryRestrictions.includes(restriction)
        )
      );
    }

    // Apply max time filter
    if (activeFilters.maxTime > 0) {
      results = results.filter(
        recipe => recipe.prepTime + recipe.cookTime <= activeFilters.maxTime
      );
    }

    // Apply max calories filter
    if (activeFilters.maxCalories > 0) {
      results = results.filter(
        recipe => recipe.calories <= activeFilters.maxCalories
      );
    }

    // Filter by available ingredients
    if (activeFilters.useAvailableIngredients && ingredients.length > 0) {
      const availableIngredientNames = ingredients.map(i => 
        i.name.toLowerCase()
      );
      
      results = results.filter(recipe => {
        // Count how many ingredients from the recipe we have
        const recipeIngredients = recipe.ingredients.map(i => 
          i.name.toLowerCase()
        );
        
        const matchCount = recipeIngredients.filter(ingredient => 
          availableIngredientNames.some(available => 
            ingredient.includes(available) || available.includes(ingredient)
          )
        ).length;
        
        // If we have at least 70% of the ingredients, include the recipe
        return matchCount / recipeIngredients.length >= 0.7;
      });
    }

    setFilteredRecipes(results);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleFilterApply = (filters: FilterOptions) => {
    setActiveFilters(filters);
    setShowFilterModal(false);
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <RecipeCard
      recipe={item}
      style={styles.recipeCard}
      onPress={() => router.push(`/recipe/${item.id}`)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No recipes found</Text>
      <Text style={styles.emptyText}>
        Try adjusting your filters or search for something else
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipes</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textExtraLight}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {Object.values(activeFilters).some(
        filter => Array.isArray(filter) ? filter.length > 0 : filter
      ) && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            Active filters: {activeFilters.mealType.length > 0 ? `${activeFilters.mealType.length} meal types` : ""}
            {activeFilters.difficulty.length > 0 ? `, ${activeFilters.difficulty.length} difficulties` : ""}
            {activeFilters.dietaryRestrictions.length > 0 ? `, ${activeFilters.dietaryRestrictions.length} dietary` : ""}
            {activeFilters.maxTime > 0 ? `, max ${activeFilters.maxTime} min` : ""}
            {activeFilters.maxCalories > 0 ? `, max ${activeFilters.maxCalories} cal` : ""}
            {activeFilters.useAvailableIngredients ? ", using your ingredients" : ""}
          </Text>
          <TouchableOpacity
            onPress={() => setActiveFilters({
              mealType: [],
              difficulty: [],
              dietaryRestrictions: [...preferences.dietaryRestrictions],
              maxTime: 0,
              maxCalories: 0,
              useAvailableIngredients: false,
            })}
          >
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.recipesList}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        initialFilters={activeFilters}
        userPreferences={preferences}
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.text,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  recipesList: {
    padding: 8,
  },
  recipeCard: {
    flex: 1,
    margin: 8,
    maxWidth: "50%",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "center",
  },
  activeFiltersContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  activeFiltersText: {
    fontSize: 12,
    color: Colors.textLight,
    flex: 1,
  },
  clearFiltersText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
    marginLeft: 8,
  },
});