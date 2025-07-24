import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserPreferences {
  goal: string;
  dietaryRestrictions: string[];
  cookingTime: string;
  flavorPreferences: string[];
  onboardingCompleted: boolean;
}

interface UserState {
  preferences: UserPreferences;
  setUserPreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  goal: "",
  dietaryRestrictions: [],
  cookingTime: "",
  flavorPreferences: [],
  onboardingCompleted: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      setUserPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
      resetPreferences: () => set({ preferences: defaultPreferences }),
    }),
    {
      name: "chief-ai-user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);