import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, Plus, X, Check, Trash2 } from "lucide-react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";
import { useShoppingListStore, ShoppingItem } from "@/store/shoppingListStore";

export default function ShoppingListScreen() {
  const router = useRouter();
  const { items, addItem, removeItem, toggleItemChecked, clearCheckedItems, clearAllItems } = useShoppingListStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [newItemName, setNewItemName] = useState("");

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group items by category
  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category || "Other";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, ShoppingItem[]>);

  // Sort categories
  const sortedCategories = Object.keys(groupedItems).sort();

  const handleAddItem = () => {
    if (newItemName.trim()) {
      addItem({
        id: Date.now().toString(),
        name: newItemName.trim(),
        checked: false,
        category: "Other",
      });
      setNewItemName("");
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleClearChecked = () => {
    Alert.alert(
      "Clear Checked Items",
      "Are you sure you want to remove all checked items?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearCheckedItems
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Items",
      "Are you sure you want to clear your entire shopping list?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: clearAllItems
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={[styles.checkbox, item.checked && styles.checkedBox]}
        onPress={() => toggleItemChecked(item.id)}
      >
        {item.checked && <Check size={16} color={Colors.white} />}
      </TouchableOpacity>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, item.checked && styles.checkedText]}>
          {item.name}
        </Text>
        {item.quantity && item.unit && (
          <Text style={styles.itemQuantity}>
            {item.quantity} {item.unit}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Trash2 size={18} color={Colors.textLight} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Your shopping list is empty</Text>
      <Text style={styles.emptyText}>
        Add items manually or generate a list from your meal plan
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List</Text>
        {items.length > 0 && (
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleClearChecked}>
              <Text style={styles.clearText}>Clear Checked</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={[styles.clearText, { color: Colors.error }]}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.addItemInput}
          placeholder="Add an item..."
          value={newItemName}
          onChangeText={setNewItemName}
          onSubmitEditing={handleAddItem}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addButton, !newItemName.trim() && styles.disabledButton]}
          onPress={handleAddItem}
          disabled={!newItemName.trim()}
        >
          <Plus size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {items.length > 0 && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items..."
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
      )}

      {items.length > 0 ? (
        <FlatList
          data={sortedCategories}
          keyExtractor={(category) => category}
          renderItem={({ item: category }) => (
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {groupedItems[category].map((item) => (
                <View key={item.id}>
                  {renderItem({ item })}
                </View>
              ))}
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },
  headerActions: {
    flexDirection: "row",
  },
  clearText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
    marginLeft: 16,
  },
  addItemContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  addItemInput: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
    marginRight: 12,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: Colors.primaryLight,
    opacity: 0.7,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: Colors.text,
  },
  listContent: {
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  checkedText: {
    textDecorationLine: "line-through",
    color: Colors.textLight,
  },
  itemQuantity: {
    fontSize: 14,
    color: Colors.textLight,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "center",
  },
});