import CustomNavBar from "@/components/tabBar/CustomNavBar";
import { Tabs } from "expo-router";

export default function SupervisorTabs() {
  return (
    <Tabs
      tabBar={(props) => <CustomNavBar {...props} />}
      screenOptions={{
        animation: "shift",
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
