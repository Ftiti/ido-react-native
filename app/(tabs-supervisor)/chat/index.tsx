// app/(tabs-agent)/missions/index.tsx
import { ThemedText } from "@/components";
import { Colors } from "@/constants/theme";
import { fakeIntervention } from "@/mock";
import { ScrollView, useColorScheme, View } from "react-native";

const Index = () => {
  // <- PascalCase
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  console.log(fakeIntervention);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themeColors.background,
      }}
    >
      <View>
        {/* Your content here */}
        <ThemedText>Chat</ThemedText>
      </View>
    </ScrollView>
  );
};

export default Index;
