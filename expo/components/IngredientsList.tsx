import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import Colors from "@/constants/colors";
import { Ingredient } from "@/store/ingredientsStore";

interface IngredientsListProps {
  ingredients: Ingredient[];
  horizontal?: boolean;
  onPress?: () => void;
}

export default function IngredientsList({ ingredients, horizontal = false, onPress }: IngredientsListProps) {
  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContainer}
      >
        {ingredients.map((ingredient) => (
          <TouchableOpacity
            key={ingredient.id}
            style={styles.horizontalItem}
            onPress={onPress}
          >
            {ingredient.imageUrl ? (
              <Image source={{ uri: ingredient.imageUrl }} style={styles.horizontalImage} />
            ) : (
              <View style={[styles.horizontalImage, { backgroundColor: Colors.primaryLight }]} />
            )}
            <Text style={styles.horizontalName} numberOfLines={1}>
              {ingredient.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {ingredients.map((ingredient) => (
        <View key={ingredient.id} style={styles.item}>
          {ingredient.imageUrl ? (
            <Image source={{ uri: ingredient.imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.image, { backgroundColor: Colors.primaryLight }]} />
          )}
          <View style={styles.info}>
            <Text style={styles.name}>{ingredient.name}</Text>
            <Text style={styles.category}>{ingredient.category}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: Colors.textLight,
  },
  horizontalContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  horizontalItem: {
    alignItems: "center",
    marginRight: 16,
    width: 70,
  },
  horizontalImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  horizontalName: {
    fontSize: 12,
    color: Colors.text,
    textAlign: "center",
  },
});