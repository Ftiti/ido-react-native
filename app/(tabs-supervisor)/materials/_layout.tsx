import { Stack } from "expo-router";

export default function MaterialsLayout() {
  return <Stack>
           <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>;
}
