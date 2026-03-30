import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useAuthStore } from "@/app-states/AuthStore";
import { runMigrations } from "@/app-utils/sqlite";
import { ToastProvider } from "@/components/toast/Toast";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { FontSizeProvider } from "@/app-contexts/FontSizeContext";
import { queryClient } from "@/app-services/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await runMigrations(); 
        await useAuthStore.getState().hydrate(); 
        setReady(true); 
      } catch (err) {
        console.error("Database initialization failed:", err);
      }
    })();
  }, []);

  if (!ready) return null; 

  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <FontSizeProvider>
        <ToastProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
              animationDuration: 400,
            }}
          />
        </ToastProvider>
      </FontSizeProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
    </QueryClientProvider>
  );
}
