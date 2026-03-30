import { Colors } from "@/constants/theme";
import { Platform, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useTabTheme = () => {
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;

  const activeColor = scheme === "dark" ? "#53BDEB" : "#0086EA";
  const inactiveColor = scheme === "dark" ? "#8696A0" : "#667781";
  const tabBarBackground = scheme === "dark" ? "#1F2C34" : "#FFFFFF";

  const bottomPadding = Platform.select({
    ios: Math.max(insets.bottom, 8) + 8,
    android: Math.max(insets.bottom + 12, 16),
    default: 16,
  });

  return {
    scheme,
    themeColors,
    activeColor,
    inactiveColor,
    tabBarBackground,
    bottomPadding,
  };
};