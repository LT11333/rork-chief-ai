import { StyleSheet } from "react-native";
import Colors from "./colors";

export const globalStyles = StyleSheet.create({
  // Layout containers
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Section styling
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  
  // Card styling
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 12,
  },
  
  // Button styling
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonOutlineText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonSmallText: {
    fontSize: 14,
  },
  
  // Input styling
  input: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textLight,
    marginBottom: 8,
  },
  
  // Typography
  heading1: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  heading3: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 24,
  },
  smallText: {
    fontSize: 14,
    color: Colors.textExtraLight,
  },
  
  // Layout helpers
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  
  // Tag styling
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: Colors.primaryLight,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: Colors.primaryDark,
    fontSize: 14,
    fontWeight: "500",
  },
  
  // Progress indicators
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: Colors.backgroundLight,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.backgroundLight,
    overflow: "hidden",
  },
  
  // List items
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  listItemText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  
  // Calendar styling
  calendarDay: {
    width: 40,
    height: 60,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: "500",
  },
  calendarDayNumber: {
    fontSize: 18,
    fontWeight: "700",
  },
  
  // Badge styling
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
  
  // Subscription badge
  subscriptionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: Colors.premium,
  },
  subscriptionBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
});