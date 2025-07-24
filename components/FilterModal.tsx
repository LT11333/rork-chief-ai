import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch } from "react-native";
import Slider from "@react-native-community/slider";
import { X } from "lucide-react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";
import { UserPreferences } from "@/store/userStore";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
  userPreferences: UserPreferences;
}

interface FilterOptions {
  mealType: string[];
  difficulty: string[];
  dietaryRestrictions: string[];
  maxTime: number;
  maxCalories: number;
  useAvailableIngredients: boolean;
}

const mealTypes = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
  { id: "dessert", label: "Dessert" },
];

const difficulties = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

const dietaryRestrictions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-free" },
  { id: "dairy-free", label: "Dairy-free" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
];

export default function FilterModal({ visible, onClose, onApply, initialFilters, userPreferences }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const toggleMealType = (id: string) => {
    setFilters((prev: FilterOptions) => {
      const current = [...prev.mealType];
      if (current.includes(id)) {
        return { ...prev, mealType: current.filter(item => item !== id) };
      } else {
        return { ...prev, mealType: [...current, id] };
      }
    });
  };

  const toggleDifficulty = (id: string) => {
    setFilters((prev: FilterOptions) => {
      const current = [...prev.difficulty];
      if (current.includes(id)) {
        return { ...prev, difficulty: current.filter(item => item !== id) };
      } else {
        return { ...prev, difficulty: [...current, id] };
      }
    });
  };

  const toggleDietaryRestriction = (id: string) => {
    setFilters((prev: FilterOptions) => {
      const current = [...prev.dietaryRestrictions];
      if (current.includes(id)) {
        return { ...prev, dietaryRestrictions: current.filter(item => item !== id) };
      } else {
        return { ...prev, dietaryRestrictions: [...current, id] };
      }
    });
  };

  const toggleUseAvailableIngredients = () => {
    setFilters((prev: FilterOptions) => ({
      ...prev,
      useAvailableIngredients: !prev.useAvailableIngredients,
    }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const resetFilters = () => {
    setFilters({
      mealType: [],
      difficulty: [],
      dietaryRestrictions: [...userPreferences.dietaryRestrictions],
      maxTime: 0,
      maxCalories: 0,
      useAvailableIngredients: false,
    });
  };

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
            <Text style={styles.modalTitle}>Filter Recipes</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Meal Type</Text>
              <View style={styles.filterOptions}>
                {mealTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.filterOption,
                      filters.mealType.includes(type.id) && styles.selectedOption,
                    ]}
                    onPress={() => toggleMealType(type.id)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.mealType.includes(type.id) && styles.selectedOptionText,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Difficulty</Text>
              <View style={styles.filterOptions}>
                {difficulties.map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty.id}
                    style={[
                      styles.filterOption,
                      filters.difficulty.includes(difficulty.id) && styles.selectedOption,
                    ]}
                    onPress={() => toggleDifficulty(difficulty.id)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.difficulty.includes(difficulty.id) && styles.selectedOptionText,
                      ]}
                    >
                      {difficulty.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Dietary Restrictions</Text>
              <View style={styles.filterOptions}>
                {dietaryRestrictions.map((restriction) => (
                  <TouchableOpacity
                    key={restriction.id}
                    style={[
                      styles.filterOption,
                      filters.dietaryRestrictions.includes(restriction.id) && styles.selectedOption,
                    ]}
                    onPress={() => toggleDietaryRestriction(restriction.id)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.dietaryRestrictions.includes(restriction.id) && styles.selectedOptionText,
                      ]}
                    >
                      {restriction.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Max Time (minutes)</Text>
              <Text style={styles.sliderValue}>
                {filters.maxTime > 0 ? `${filters.maxTime} minutes` : "No limit"}
              </Text>
              <Slider
                value={filters.maxTime}
                onValueChange={(value: number) => setFilters((prev: FilterOptions) => ({ ...prev, maxTime: value }))}
                minimumValue={0}
                maximumValue={120}
                step={15}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.border}
                thumbTintColor={Colors.primary}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>No limit</Text>
                <Text style={styles.sliderLabel}>2 hours</Text>
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Max Calories</Text>
              <Text style={styles.sliderValue}>
                {filters.maxCalories > 0 ? `${filters.maxCalories} calories` : "No limit"}
              </Text>
              <Slider
                value={filters.maxCalories}
                onValueChange={(value: number) => setFilters((prev: FilterOptions) => ({ ...prev, maxCalories: value }))}
                minimumValue={0}
                maximumValue={1000}
                step={100}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.border}
                thumbTintColor={Colors.primary}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>No limit</Text>
                <Text style={styles.sliderLabel}>1000 cal</Text>
              </View>
            </View>

            <View style={styles.switchSection}>
              <Text style={styles.filterTitle}>Use Available Ingredients</Text>
              <Switch
                value={filters.useAvailableIngredients}
                onValueChange={toggleUseAvailableIngredients}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={filters.useAvailableIngredients ? Colors.primary : Colors.textExtraLight}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonOutline, styles.footerButton]}
              onPress={resetFilters}
            >
              <Text style={globalStyles.buttonOutlineText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.button, styles.footerButton]}
              onPress={handleApply}
            >
              <Text style={globalStyles.buttonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
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
    maxHeight: "90%",
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
  modalBody: {
    padding: 16,
    maxHeight: "70%",
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: Colors.backgroundLight,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: Colors.primaryLight,
  },
  filterOptionText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  selectedOptionText: {
    color: Colors.primaryDark,
    fontWeight: "500",
  },
  sliderValue: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
    marginBottom: 8,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  switchSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});