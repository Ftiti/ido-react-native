import { useAuthStore } from "@/app-states/auth/AuthStore";
import { ThemedText } from "@/components/index";
import { useRouter } from "expo-router"; // si tu utilises expo-router
import { StyleSheet, TouchableOpacity, View } from "react-native";

const Profil = () => {
  const router = useRouter();
  const loginStore = useAuthStore(); // get the store instance

  const handleLogout = async () => {
    // 🔹 Ici tu peux supprimer le token (AsyncStorage par exemple)
    // await AsyncStorage.removeItem("token");
    loginStore.logout();
    // 🔹 Redirection vers login
    router.replace("/(auth)");
  };

  return (
    <View style={styles.container}>
      <ThemedText>Profil</ThemedText>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

export default Profil;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: "#e53935",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});
