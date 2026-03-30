import { SafeAreaProviderWrapper } from "@/components/safeArea/TabSafeAreaProvider";
import CustomNavBar from "@/components/tabBar/CustomNavBar";
import { Tabs } from "expo-router";
import React from "react";

const TAB_BAR_HEIGHT = 100; // match your custom tab height

export default function AgentTabs() {
  return (
    <SafeAreaProviderWrapper tabBarHeight={TAB_BAR_HEIGHT}>
      <Tabs
        tabBar={(props) => <CustomNavBar {...props} />}
        screenOptions={{
          animation: "shift",
          headerShown: false,
        }}
      >
        <Tabs.Screen name="missions" options={{ title: "Missions" }} />
        <Tabs.Screen name="chat" options={{ title: "Messagerie" }} />
        <Tabs.Screen name="absences" options={{ title: "Absences" }} />
        <Tabs.Screen name="materials" options={{ title: "Matériels" }} />
        <Tabs.Screen name="profil" options={{ title: "Profil" }} />
      </Tabs>
    </SafeAreaProviderWrapper>
  );
}
