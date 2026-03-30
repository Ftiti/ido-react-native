// app/(tabs-agent)/missions/_layout.tsx
<<<<<<< HEAD
import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

const MissionsLayout = () => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 400,
        contentStyle: {
          backgroundColor: themeColors.background,
        },
      }}
    >
      <Stack.Screen name="index" />
      {/* Add other screens here if needed */}
    </Stack>
  );
=======
import { Stack } from "expo-router";
import React from "react";

const MissionsLayout = () => {
   return (
      <Stack>
         <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
   );
>>>>>>> main
};

export default MissionsLayout;
