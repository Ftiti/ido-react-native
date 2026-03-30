import Feather from "@expo/vector-icons/Feather";

export const getTabIcon = (routeName: string, color: string) => {
  const iconMap: Record<string, React.ComponentProps<typeof Feather>["name"]> =
    {
      missions: "grid",
      chat: "message-circle",
      absences: "user-x",
      materials: "tool",
      profil: "user",
    };

  return (
    <Feather name={iconMap[routeName] ?? "home"} size={24} color={color} />
  );
};
