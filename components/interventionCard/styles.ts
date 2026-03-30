import { StyleSheet } from "react-native";

export const createStyles = (colors: {
  background: string;
  text: string;
  tint: string;
  icon: string;
}) =>
  StyleSheet.create({
    cardContainer: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },

    card: {
      borderRadius: 16,
      padding: 12,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.icon + "33",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },

    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    logoContainer: {
      width: 56,
      height: 56,
      borderRadius: 14,
      marginRight: 10,
      borderWidth: 1,
      borderColor: colors.icon + "33",
    },

    headerInfo: { flex: 1 },

    interventionName: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 6,
    },

    timeChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.tint + "1A",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.tint + "33",
      alignSelf: "flex-start",
    },

    timeIcon: {
      fontSize: 12,
      marginRight: 4,
    },

    timeText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.tint,
    },

    divider: {
      height: 1,
      backgroundColor: colors.icon + "33",
      marginBottom: 12,
    },

    membersContainer: { gap: 8 },

    memberCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.background,
      padding: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.icon + "33",
    },

    memberLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginRight: 10,
    },

    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },

    iconText: { fontSize: 22 },

    memberInfo: { flex: 1 },

    memberName: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },

    memberSubtext: {
      fontSize: 12,
      color: colors.icon,
      fontWeight: "500",
    },

    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.icon + "33",
    },

    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 4,
    },

    statusText: {
      fontSize: 11,
      fontWeight: "600",
    },

    expandableContainer: {
      overflow: "hidden",
      marginTop: 10,
    },

    toggleButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: colors.icon + "1A",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.icon + "33",
    },

    toggleText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.text,
      marginRight: 6,
    },

    chevron: {
      fontSize: 13,
      color: colors.text,
      fontWeight: "600",
    },
  });
