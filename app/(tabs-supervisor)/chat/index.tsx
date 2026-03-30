<<<<<<< HEAD
// app/(tabs-agent)/missions/index.tsx
import { ThemedText } from "@/components";
import { Colors } from "@/constants/theme";
import { fakeIntervention } from "@/mock";
import { ScrollView, useColorScheme, View } from "react-native";

const Index = () => {
  // <- PascalCase
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  console.log(fakeIntervention);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themeColors.background,
      }}
    >
      <View>
        {/* Your content here */}
        <ThemedText>Chat</ThemedText>
      </View>
    </ScrollView>
  );
};

=======


import { adjustFontSize, useFontSize } from "@/app-contexts/FontSizeContext";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";

import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

type ChatUser = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar?: string;
  online?: boolean;
};

const mockIndividualChats: ChatUser[] = [
  { id: "1", name: "Ahmed Ben Ali", lastMessage: "Mission terminée", time: "10:30", unread: 2, online: true },
  { id: "2", name: "Fatima Zahra", lastMessage: "D'accord, merci", time: "09:15", unread: 0, online: false },
  { id: "3", name: "Mohamed Salah", lastMessage: "Je suis en route", time: "Hier", unread: 1, online: true },
  { id: "4", name: "Amira Mansour", lastMessage: "Photo envoyée", time: "Hier", unread: 0, online: false },
];

const mockGroupChats: ChatUser[] = [
  { id: "g1", name: "Équipe Nord", lastMessage: "Ahmed: Parfait!", time: "11:20", unread: 5, online: false },
  { id: "g2", name: "Superviseurs", lastMessage: "Fatima: Réunion demain", time: "08:45", unread: 0, online: false },
  { id: "g3", name: "Projet Alpha", lastMessage: "Mohamed: Besoin d'aide", time: "Lundi", unread: 3, online: false },
];

const Index = () => {
  const scheme = useColorScheme();
  const [currentScheme, setCurrentScheme] = useState(scheme);
  const colors = Colors[currentScheme ?? "light"];
  const [activeTab, setActiveTab] = useState<"individual" | "group">("individual");
  const router = useRouter();
  const { fontSizeAdjustment } = useFontSize();

  useEffect(() => {
    setCurrentScheme(scheme);
  }, [scheme]);

  const currentChats = activeTab === "individual" ? mockIndividualChats : mockGroupChats;

  const renderChatItem = useCallback(({ item }: { item: ChatUser }) => {
    const itemBgColor = currentScheme === "dark" ? "#1a1a1a" : "#fff";
    const borderColor = currentScheme === "dark" ? colors.background : "#fff";
    
    return (
      <Pressable
        style={[styles.chatItem, { backgroundColor: itemBgColor }]}
        android_ripple={{ color: colors.icon + "20" }}
        onPress={() => router.push({ pathname: `/chat-room/${item.id}`, params: { name: item.name } } as any)}
      >
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.tint + "30" }]}>
              <Text style={[styles.avatarText, { color: colors.tint, fontSize: adjustFontSize(20, fontSizeAdjustment) }]}>
                {item.name.charAt(0)}
              </Text>
            </View>
          )}
          {item.online && (
            <View style={[styles.onlineIndicator, { borderColor }]} />
          )}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatName, { color: colors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.chatTime, { color: colors.icon, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>{item.time}</Text>
          </View>
          <View style={styles.chatFooter}>
            <Text 
              style={[styles.lastMessage, { color: currentScheme === "dark" ? colors.icon : "#666", fontSize: adjustFontSize(14, fontSizeAdjustment) }]} 
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
            {item.unread > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.tint }]}>
                <Text style={[styles.unreadText, { fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>{item.unread}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  }, [currentScheme, colors, fontSizeAdjustment]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tabs */}
      <View style={[styles.tabContainer, { borderBottomColor: colors.icon + "30" }]}>
        <Pressable
          style={[styles.tab, activeTab === "individual" && { borderBottomColor: colors.tint }]}
          onPress={() => setActiveTab("individual")}
        >
          <Ionicons
            name="person"
            size={20}
            color={activeTab === "individual" ? colors.tint : colors.icon}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === "individual" ? colors.tint : colors.icon, fontSize: adjustFontSize(16, fontSizeAdjustment) },
            ]}
          >
            Individuel
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === "group" && { borderBottomColor: colors.tint }]}
          onPress={() => setActiveTab("group")}
        >
          <Ionicons
            name="people"
            size={20}
            color={activeTab === "group" ? colors.tint : colors.icon}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === "group" ? colors.tint : colors.icon, fontSize: adjustFontSize(16, fontSizeAdjustment) },
            ]}
          >
            Groupe
          </Text>
        </Pressable>
      </View>

      {/* Chat List */}
      <FlatList
        data={currentChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => `${item.id}-${currentScheme}`}
        contentContainerStyle={styles.listContent}
        extraData={currentScheme}
        removeClippedSubviews={false}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.icon + "20" }]} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "600",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    marginLeft: 8,
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    marginLeft: 78,
  },
});

>>>>>>> main
export default Index;
