import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: {
    id: string;
    name: string;
    amount: string;
    available?: boolean;
  }[];
  instructions: string[];
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  mealType: string[];
  dietaryRestrictions: string[];
  isFavorite?: boolean;
}

interface RecipesState {
  recipes: Recipe[];
  favoriteRecipes: string[];
  recentlyViewed: string[];
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  addToRecentlyViewed: (id: string) => void;
  clearRecentlyViewed: () => void;
}

export const useRecipesStore = create<RecipesState>()(
  persist(
    (set) => ({
      recipes: [],
      favoriteRecipes: [],
      recentlyViewed: [],
      addToFavorites: (id) =>
        set((state) => ({
          favoriteRecipes: [...state.favoriteRecipes, id],
        })),
      removeFromFavorites: (id) =>
        set((state) => ({
          favoriteRecipes: state.favoriteRecipes.filter((recipeId) => recipeId !== id),
        })),
      addToRecentlyViewed: (id) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((recipeId) => recipeId !== id);
          return {
            recentlyViewed: [id, ...filtered].slice(0, 10), // Keep only 10 most recent
          };
        }),
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
    }),
    {
      name: "chief-ai-recipes-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);