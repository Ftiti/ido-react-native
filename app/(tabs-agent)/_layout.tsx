import CustomTabBar from "@/components/tabBar/CustomTabBar";
import { Tabs } from "expo-router";

const TAB_BAR_HEIGHT = 100; // match your custom tab height

export default function AgentTabs() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
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
  );
}
