import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle, GestureResponderEvent } from "react-native";
import { Heart, Clock, Star } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useRecipesStore } from "@/store/recipesStore";

interface RecipeCardProps {
  recipe: {
    id: string;
    name: string;
    imageUrl: string;
    prepTime: number;
    cookTime: number;
    calories: number;
    difficulty: string;
    tags: string[];
  };
  style?: ViewStyle;
  onPress?: () => void;
  showRating?: boolean;
}

export default function RecipeCard({ recipe, style, onPress, showRating = false }: RecipeCardProps) {
  const { favoriteRecipes, addToFavorites, removeFromFavorites } = useRecipesStore();
  const isFavorite = favoriteRecipes.includes(recipe.id);

  const handleFavoritePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe.id);
    }
  };
  
  // Generate a random rating between 4.0 and 5.0
  const rating = (4 + Math.random()).toFixed(1);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <Heart
            size={16}
            color={Colors.white}
            fill={isFavorite ? Colors.secondary : "none"}
          />
        </TouchableOpacity>
        
        {showRating && (
          <View style={styles.ratingContainer}>
            <Star size={12} color={Colors.accent} fill={Colors.accent} />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        )}
        
        <View style={styles.timeContainer}>
          <Clock size={12} color={Colors.white} />
          <Text style={styles.timeText}>
            {recipe.prepTime + recipe.cookTime} min
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.name}
        </Text>
        <View style={styles.metaContainer}>
          <View style={styles.calorieContainer}>
            <Text style={styles.calorieText}>{recipe.calories} kcal</Text>
          </View>
          {recipe.difficulty && (
            <View style={[
              styles.difficultyTag, 
              recipe.difficulty === "easy" ? styles.easyTag : 
              recipe.difficulty === "medium" ? styles.mediumTag : 
              styles.hardTag
            ]}>
              <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
            </View>
          )}
        </View>
        {recipe.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {recipe.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    height: 140,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  ratingContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  timeContainer: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  calorieContainer: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  calorieText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: "500",
  },
  difficultyTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  easyTag: {
    backgroundColor: Colors.primaryLight,
  },
  mediumTag: {
    backgroundColor: Colors.accentLight,
  },
  hardTag: {
    backgroundColor: Colors.secondaryLight,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "500",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: Colors.textLight,
  },
});