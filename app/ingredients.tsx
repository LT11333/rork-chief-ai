import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, Plus, X, Edit, Trash2 } from "lucide-react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";
import { useIngredientsStore, Ingredient } from "@/store/ingredientsStore";
import { mockIngredients } from "@/mocks/ingredients";

export default function IngredientsScreen() {
  const router = useRouter();
  const { ingredients, addIngredient, removeIngredient, updateIngredient } = useIngredientsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof mockIngredients>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ingredient.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.length > 1) {
      // Filter mock ingredients that are not already in the user's ingredients
      const existingIds = new Set(ingredients.map(i => i.id));
      const filtered = mockIngredients
        .filter(i => !existingIds.has(i.id))
        .filter(i => 
          i.name.toLowerCase().includes(text.toLowerCase()) ||
          i.category.toLowerCase().includes(text.toLowerCase())
        )
        .slice(0, 5);
      
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddIngredient = (ingredient: Ingredient) => {
    addIngredient(ingredient);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleRemoveIngredient = (id: string) => {
    Alert.alert(
      "Remove Ingredient",
      "Are you sure you want to remove this ingredient?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeIngredient(id)
        }
      ]
    );
  };

  const renderIngredientItem = ({ item }: { item: Ingredient }) => (
    <View style={styles.ingredientItem}>
      <View style={styles.ingredientInfo}>
        <Text style={styles.ingredientName}>{item.name}</Text>
        <Text style={styles.ingredientCategory}>{item.category}</Text>
      </View>
      <View style={styles.ingredientActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRemoveIngredient(item.id)}
        >
          <Trash2 size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSuggestionItem = ({ item }: { item: Ingredient }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleAddIngredient(item)}
    >
      <Text style={styles.suggestionName}>{item.name}</Text>
      <Text style={styles.suggestionCategory}>{item.category}</Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No ingredients found</Text>
      <Text style={styles.emptyText}>
        Add ingredients by scanning your fridge or adding them manually
      </Text>
      <TouchableOpacity
        style={[globalStyles.button, styles.scanButton]}
        onPress={() => router.push("/scan")}
      >
        <Text style={globalStyles.buttonText}>Scan Ingredients</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Ingredients</Text>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => router.push("/scan")}
        >
          <Plus size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search or add ingredients..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={Colors.textExtraLight}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Suggestions</Text>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      )}

      <FlatList
        data={filteredIngredients}
        renderItem={renderIngredientItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ingredientsList}
        ListEmptyComponent={renderEmptyState}
      />

      {ingredients.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => router.push("/recipes")}
          >
            <Text style={globalStyles.buttonText}>Find Recipes</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingVertical: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },
  scanButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
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
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textLight,
    marginBottom: 8,
  },
  suggestionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 4,
  },
  suggestionCategory: {
    fontSize: 14,
    color: Colors.textLight,
  },
  ingredientsList: {
    padding: 16,
    flexGrow: 1,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 4,
  },
  ingredientCategory: {
    fontSize: 14,
    color: Colors.textLight,
  },
  ingredientActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
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
    marginBottom: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});