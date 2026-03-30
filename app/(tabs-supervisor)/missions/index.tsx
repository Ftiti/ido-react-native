// app/(tabs-agent)/missions/index.tsx
import { usePlannings } from "@/app-services/plannings/usePlannings";
import { Colors } from "@/constants/theme";
import React, { useMemo, useState } from "react";
import { Text, useColorScheme, View } from "react-native";
const formatDate = (date: Date) => date.toISOString().split("T")[0];

const Index = () => {
  // <- PascalCase
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  const [date, setDate] = useState(new Date());

  const formattedDate = useMemo(() => formatDate(date), [date]);

  const {
    data: plannings = [],
    isLoading,
    isFetching,
    error,
  } = usePlannings(formattedDate);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themeColors.background,
      }}
    >
      <Text style={{ color: themeColors.text }}>hello missions</Text>
    </View>
  );
};

export default Index;
