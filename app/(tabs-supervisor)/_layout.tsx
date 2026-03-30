<<<<<<< HEAD
import CustomTabBar from "@/components/tabBar/CustomTabBar";
=======
import CustomNavBar from "@/components/tabBar/CustomNavBar";
>>>>>>> main
import { Tabs } from "expo-router";

export default function SupervisorTabs() {
  return (
    <Tabs
<<<<<<< HEAD
      tabBar={(props) => <CustomTabBar {...props} />}
=======
      tabBar={(props) => <CustomNavBar {...props} />}
>>>>>>> main
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
