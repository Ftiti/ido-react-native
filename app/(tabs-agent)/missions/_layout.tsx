// app/(tabs-agent)/missions/_layout.tsx
import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

const MissionsLayout = () => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Stack
      screenOptions={{
        headerTitle: "Missions Agent", // Titre personnalisé
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 400,
        contentStyle: {
          backgroundColor: themeColors.background,
          flex: 1, // Style flex appliqué
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default MissionsLayout;
