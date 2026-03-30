import { Stack } from "expo-router";

export default function ProfilLayout() {
  return (
        <Stack>
           <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
     );
}
