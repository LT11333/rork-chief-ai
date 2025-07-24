import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle } from "react-native";
import { Clock } from "lucide-react-native";
import Colors from "@/constants/colors";

interface MealPlanCardProps {
  recipe: {
    id: string;
    name: string;
    imageUrl: string;
    prepTime: number;
    cookTime: number;
    calories: number;
    difficulty?: string;
    tags?: string[];
  } | null;
  style?: ViewStyle;
  onPress?: () => void;
  onLongPress?: () => void;
}

export default function MealPlanCard({ recipe, style, onPress, onLongPress }: MealPlanCardProps) {
  if (!recipe) return null;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.name}
        </Text>
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Clock size={12} color={Colors.textLight} />
            <Text style={styles.metaText}>
              {recipe.prepTime + recipe.cookTime} min
            </Text>
          </View>
          <Text style={styles.metaText}>{recipe.calories} cal</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
});