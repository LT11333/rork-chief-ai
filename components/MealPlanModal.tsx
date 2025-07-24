import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, TextInput } from "react-native";
import { X, Search } from "lucide-react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";
import { mockRecipes } from "@/mocks/recipes";
import RecipeCard from "./RecipeCard";

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
}

interface MealPlanModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (recipeId: string) => void;
  mealType: string;
}

export default function MealPlanModal({ visible, onClose, onSelect, mealType }: MealPlanModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecipes = mockRecipes.filter(recipe => {
    // Filter by meal type if applicable
    if (mealType === "breakfast" && !recipe.mealType.includes("breakfast")) {
      return false;
    }
    if (mealType === "lunch" && !recipe.mealType.includes("lunch")) {
      return false;
    }
    if (mealType === "dinner" && !recipe.mealType.includes("dinner")) {
      return false;
    }
    if (mealType === "snacks" && !recipe.mealType.includes("snack")) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      return recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return true;
  });

  const getMealTypeTitle = () => {
    switch (mealType) {
      case "breakfast":
        return "Select Breakfast";
      case "lunch":
        return "Select Lunch";
      case "dinner":
        return "Select Dinner";
      case "snacks":
        return "Select Snack";
      default:
        return "Select Recipe";
    }
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <RecipeCard
      recipe={item}
      style={styles.recipeCard}
      onPress={() => onSelect(item.id)}
    />
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{getMealTypeTitle()}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
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
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <X size={20} color={Colors.textLight} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <FlatList
            data={filteredRecipes}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.recipesList}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No recipes found</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  searchContainer: {
    padding: 16,
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
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
  },
});