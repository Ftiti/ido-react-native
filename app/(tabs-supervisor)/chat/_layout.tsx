// app/(tabs-agent)/missions/_layout.tsx
import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

const ChatLayout = () => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: themeColors.background,
        },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default ChatLayout;
