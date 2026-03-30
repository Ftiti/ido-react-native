import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    paddingTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0,0,0,0.08)",
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  tabItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingVertical: 6,
    gap: 2,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 28,
    height: 28,
  },
  text: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
    maxWidth: 80,
  },
});
