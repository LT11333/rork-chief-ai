import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MealPlanDay {
  date: string;
  breakfast?: string; // Recipe ID
  lunch?: string; // Recipe ID
  dinner?: string; // Recipe ID
  snacks?: string[]; // Recipe IDs
}

interface MealPlanState {
  mealPlan: MealPlanDay[];
  setMealForDay: (date: string, mealType: string, recipeId: string | undefined) => void;
  addSnackForDay: (date: string, recipeId: string) => void;
  removeSnackForDay: (date: string, recipeId: string) => void;
  clearMealPlan: () => void;
}

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set) => ({
      mealPlan: [],
      setMealForDay: (date, mealType, recipeId) =>
        set((state) => {
          const existingDayIndex = state.mealPlan.findIndex(day => day.date === date);
          
          if (existingDayIndex >= 0) {
            // Update existing day
            const updatedMealPlan = [...state.mealPlan];
            updatedMealPlan[existingDayIndex] = {
              ...updatedMealPlan[existingDayIndex],
              [mealType]: recipeId,
            };
            return { mealPlan: updatedMealPlan };
          } else {
            // Create new day
            return {
              mealPlan: [
                ...state.mealPlan,
                {
                  date,
                  [mealType]: recipeId,
                },
              ],
            };
          }
        }),
      addSnackForDay: (date, recipeId) =>
        set((state) => {
          const existingDayIndex = state.mealPlan.findIndex(day => day.date === date);
          
          if (existingDayIndex >= 0) {
            // Update existing day
            const updatedMealPlan = [...state.mealPlan];
            const currentSnacks = updatedMealPlan[existingDayIndex].snacks || [];
            updatedMealPlan[existingDayIndex] = {
              ...updatedMealPlan[existingDayIndex],
              snacks: [...currentSnacks, recipeId],
            };
            return { mealPlan: updatedMealPlan };
          } else {
            // Create new day
            return {
              mealPlan: [
                ...state.mealPlan,
                {
                  date,
                  snacks: [recipeId],
                },
              ],
            };
          }
        }),
      removeSnackForDay: (date, recipeId) =>
        set((state) => {
          const existingDayIndex = state.mealPlan.findIndex(day => day.date === date);
          
          if (existingDayIndex >= 0 && state.mealPlan[existingDayIndex].snacks) {
            // Update existing day
            const updatedMealPlan = [...state.mealPlan];
            const currentSnacks = updatedMealPlan[existingDayIndex].snacks || [];
            updatedMealPlan[existingDayIndex] = {
              ...updatedMealPlan[existingDayIndex],
              snacks: currentSnacks.filter(id => id !== recipeId),
            };
            return { mealPlan: updatedMealPlan };
          }
          return state;
        }),
      clearMealPlan: () => set({ mealPlan: [] }),
    }),
    {
      name: "chief-ai-meal-plan-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);