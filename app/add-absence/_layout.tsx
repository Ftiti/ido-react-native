import { Stack } from "expo-router";
import React from "react";

export default function AddAbsenceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_bottom",
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}