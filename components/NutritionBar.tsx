import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/colors";

interface NutritionBarProps {
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
}

export default function NutritionBar({
  protein,
  carbs,
  fat,
  height = 12,
  showLabels = true,
  showValues = true,
}: NutritionBarProps) {
  // Calculate total and percentages
  const total = protein + carbs + fat;
  const proteinPercent = total > 0 ? (protein / total) * 100 : 0;
  const carbsPercent = total > 0 ? (carbs / total) * 100 : 0;
  const fatPercent = total > 0 ? (fat / total) * 100 : 0;
  
  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={styles.labels}>
          <View style={styles.labelItem}>
            <View style={[styles.colorIndicator, { backgroundColor: Colors.protein }]} />
            <Text style={styles.labelText}>Protein</Text>
            {showValues && <Text style={styles.valueText}>{protein}g</Text>}
          </View>
          
          <View style={styles.labelItem}>
            <View style={[styles.colorIndicator, { backgroundColor: Colors.carbs }]} />
            <Text style={styles.labelText}>Carbs</Text>
            {showValues && <Text style={styles.valueText}>{carbs}g</Text>}
          </View>
          
          <View style={styles.labelItem}>
            <View style={[styles.colorIndicator, { backgroundColor: Colors.fat }]} />
            <Text style={styles.labelText}>Fat</Text>
            {showValues && <Text style={styles.valueText}>{fat}g</Text>}
          </View>
        </View>
      )}
      
      <View style={[styles.barContainer, { height }]}>
        <View 
          style={[
            styles.barSegment, 
            { 
              backgroundColor: Colors.protein,
              width: `${proteinPercent}%`,
              borderTopLeftRadius: height / 2,
              borderBottomLeftRadius: height / 2,
              borderTopRightRadius: carbsPercent === 0 && fatPercent === 0 ? height / 2 : 0,
              borderBottomRightRadius: carbsPercent === 0 && fatPercent === 0 ? height / 2 : 0,
            }
          ]} 
        />
        <View 
          style={[
            styles.barSegment, 
            { 
              backgroundColor: Colors.carbs,
              width: `${carbsPercent}%`,
              borderTopRightRadius: fatPercent === 0 ? height / 2 : 0,
              borderBottomRightRadius: fatPercent === 0 ? height / 2 : 0,
            }
          ]} 
        />
        <View 
          style={[
            styles.barSegment, 
            { 
              backgroundColor: Colors.fat,
              width: `${fatPercent}%`,
              borderTopRightRadius: height / 2,
              borderBottomRightRadius: height / 2,
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  labelItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  labelText: {
    fontSize: 12,
    color: Colors.textLight,
    marginRight: 4,
  },
  valueText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },
  barContainer: {
    flexDirection: "row",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: Colors.backgroundLight,
  },
  barSegment: {
    height: "100%",
  },
});