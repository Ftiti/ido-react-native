// app/(tabs-agent)/missions/_layout.tsx
import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
<<<<<<< HEAD
=======
import React from "react";
>>>>>>> main
import { useColorScheme } from "react-native";

const ChatLayout = () => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
<<<<<<< HEAD
        animation: "slide_from_right",
        animationDuration: 400,
=======
>>>>>>> main
        contentStyle: {
          backgroundColor: themeColors.background,
        },
      }}
    >
      <Stack.Screen name="index" />
<<<<<<< HEAD
      {/* Add other screens here if needed */}
=======
>>>>>>> main
    </Stack>
  );
};

export default ChatLayout;
