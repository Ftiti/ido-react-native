// app/(tabs-agent)/missions/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

const MissionsLayout = () => {
   return (
      <Stack>
         <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
   );
};

export default MissionsLayout;
