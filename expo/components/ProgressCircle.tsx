import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Colors from "@/constants/colors";

interface ProgressCircleProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 1
  color?: string;
  backgroundColor?: string;
  label?: string;
  value?: string | number;
  unit?: string;
}

export default function ProgressCircle({
  size = 80,
  strokeWidth = 8,
  progress,
  color = Colors.primary,
  backgroundColor = Colors.backgroundLight,
  label,
  value,
  unit,
}: ProgressCircleProps) {
  // Ensure progress is between 0 and 1
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference * (1 - normalizedProgress);
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      
      {/* Center Content */}
      <View style={styles.content}>
        {value !== undefined && (
          <Text style={styles.value}>{value}</Text>
        )}
        {unit && (
          <Text style={styles.unit}>{unit}</Text>
        )}
        {label && (
          <Text style={styles.label}>{label}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },
  unit: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: -2,
  },
  label: {
    fontSize: 10,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: 2,
  },
});