import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ShoppingItem {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  category?: string;
  checked: boolean;
  recipeId?: string; // Optional reference to recipe
}

interface ShoppingListState {
  items: ShoppingItem[];
  addItem: (item: ShoppingItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<ShoppingItem>) => void;
  toggleItemChecked: (id: string) => void;
  clearCheckedItems: () => void;
  clearAllItems: () => void;
  addMultipleItems: (items: ShoppingItem[]) => void;
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        })),
      toggleItemChecked: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, checked: !i.checked } : i
          ),
        })),
      clearCheckedItems: () =>
        set((state) => ({
          items: state.items.filter((i) => !i.checked),
        })),
      clearAllItems: () => set({ items: [] }),
      addMultipleItems: (newItems) =>
        set((state) => {
          // Merge with existing items, updating quantities if needed
          const existingItemsMap = new Map(
            state.items.map((item) => [item.name.toLowerCase(), item])
          );
          
          const updatedItems = [...state.items];
          
          newItems.forEach((newItem) => {
            const existingItem = existingItemsMap.get(newItem.name.toLowerCase());
            
            if (existingItem) {
              // Update existing item
              const index = updatedItems.findIndex((i) => i.id === existingItem.id);
              if (index !== -1) {
                updatedItems[index] = {
                  ...existingItem,
                  quantity: (existingItem.quantity || 0) + (newItem.quantity || 1),
                };
              }
            } else {
              // Add new item
              updatedItems.push(newItem);
            }
          });
          
          return { items: updatedItems };
        }),
    }),
    {
      name: "chief-ai-shopping-list-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);