import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";

interface CalendarStripProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  startDate?: Date;
  daysToShow?: number;
  showMonth?: boolean;
}

export default function CalendarStrip({
  selectedDate,
  onDateSelect,
  startDate = new Date(),
  daysToShow = 14,
  showMonth = true,
}: CalendarStripProps) {
  // Generate dates
  const dates = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });
  
  // Format date to YYYY-MM-DD for comparison
  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Check if date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return formatDateKey(date) === formatDateKey(today);
  };
  
  // Check if date is selected
  const isSelected = (date: Date): boolean => {
    return formatDateKey(date) === formatDateKey(selectedDate);
  };
  
  // Get day name (Mon, Tue, etc.)
  const getDayName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  // Get day number (1-31)
  const getDayNumber = (date: Date): number => {
    return date.getDate();
  };
  
  // Get month name if showing first day of month
  const getMonthLabel = (date: Date, index: number): string | null => {
    if (!showMonth) return null;
    
    // Show month for first date
    if (index === 0) return date.toLocaleDateString('en-US', { month: 'short' });
    
    // Show month when it changes
    const prevDate = dates[index - 1];
    if (date.getMonth() !== prevDate.getMonth()) {
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
    
    return null;
  };
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((date, index) => {
          const monthLabel = getMonthLabel(date, index);
          
          return (
            <View key={formatDateKey(date)} style={styles.dateContainer}>
              {monthLabel && (
                <Text style={styles.monthLabel}>{monthLabel}</Text>
              )}
              <TouchableOpacity
                style={[
                  globalStyles.calendarDay,
                  isSelected(date) && styles.selectedDay,
                  isToday(date) && styles.todayDay,
                ]}
                onPress={() => onDateSelect(date)}
              >
                <Text 
                  style={[
                    globalStyles.calendarDayText,
                    isSelected(date) && styles.selectedDayText,
                    isToday(date) && styles.todayDayText,
                  ]}
                >
                  {getDayName(date)}
                </Text>
                <Text 
                  style={[
                    globalStyles.calendarDayNumber,
                    isSelected(date) && styles.selectedDayText,
                    isToday(date) && styles.todayDayText,
                  ]}
                >
                  {getDayNumber(date)}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dateContainer: {
    alignItems: "center",
  },
  monthLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  selectedDay: {
    backgroundColor: Colors.primary,
  },
  selectedDayText: {
    color: Colors.white,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  todayDayText: {
    color: Colors.primary,
  },
});