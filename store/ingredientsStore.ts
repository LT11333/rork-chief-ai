import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  quantity?: number;
  unit?: string;
  expiryDate?: string;
  imageUrl?: string;
  scanned?: boolean;
}

interface IngredientsState {
  ingredients: Ingredient[];
  addIngredient: (ingredient: Ingredient) => void;
  removeIngredient: (id: string) => void;
  updateIngredient: (id: string, updates: Partial<Ingredient>) => void;
  clearIngredients: () => void;
  addMultipleIngredients: (ingredients: Ingredient[]) => void;
}

export const useIngredientsStore = create<IngredientsState>()(
  persist(
    (set) => ({
      ingredients: [],
      addIngredient: (ingredient) =>
        set((state) => ({
          ingredients: [...state.ingredients, ingredient],
        })),
      removeIngredient: (id) =>
        set((state) => ({
          ingredients: state.ingredients.filter((i) => i.id !== id),
        })),
      updateIngredient: (id, updates) =>
        set((state) => ({
          ingredients: state.ingredients.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        })),
      clearIngredients: () => set({ ingredients: [] }),
      addMultipleIngredients: (newIngredients) =>
        set((state) => {
          // Filter out duplicates
          const existingIds = new Set(state.ingredients.map((i) => i.id));
          const filteredNew = newIngredients.filter((i) => !existingIds.has(i.id));
          return {
            ingredients: [...state.ingredients, ...filteredNew],
          };
        }),
    }),
    {
      name: "chief-ai-ingredients-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);