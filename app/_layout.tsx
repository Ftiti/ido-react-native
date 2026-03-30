import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useAuthStore } from "@/app-states/auth/AuthStore";
import { runMigrations } from "@/app-utils/sqlite";
import { SafeAreaProviderWrapper } from "@/components/safeArea/TabSafeAreaProvider";
import { ToastProvider } from "@/components/toast/Toast";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const TAB_BAR_HEIGHT = 100;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 1,
    },
  },
});

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
      <SafeAreaProviderWrapper tabBarHeight={TAB_BAR_HEIGHT}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <ToastProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                animationDuration: 400,
              }}
            />
          </ToastProvider>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProviderWrapper>
    </QueryClientProvider>
  );
}
