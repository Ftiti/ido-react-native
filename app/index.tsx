import { useAuthStore } from "@/app-states/AuthStore";
import { Redirect } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const loginStore = useAuthStore();
  const { isAuthenticated, role } = loginStore;

  // User not logged in
  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  // Wrap all other routes with SafeAreaView
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Supervisor */}
      {role === "supervisor" && <Redirect href="/(tabs-supervisor)/missions" />}

      {/* Agent / punctual / regular roles */}
      {(role === "agent" || role === "punctual" || role === "regular") && (
        <Redirect href="/(tabs-agent)/missions" />
      )}
    </SafeAreaView>
  );
}