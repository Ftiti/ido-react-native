// app/(tabs-agent)/missions/index.tsx
import ThemedText from "@/components/text/Text";
import { Colors } from "@/constants/theme";
import { useColorScheme, View } from "react-native";

const Index = () => {
  // <- PascalCase
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themeColors.background,
      }}
    >
      <ThemedText>Hello Missions</ThemedText>
    </View>
  );
};

export default Index;
