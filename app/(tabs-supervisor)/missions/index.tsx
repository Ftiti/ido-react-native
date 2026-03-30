<<<<<<< HEAD
// app/(tabs-agent)/missions/index.tsx
import { usePlannings } from "@/app-services/plannings/usePlannings";
import { Colors } from "@/constants/theme";
import React, { useMemo, useState } from "react";
import { Text, useColorScheme, View } from "react-native";
const formatDate = (date: Date) => date.toISOString().split("T")[0];

const Index = () => {
  // <- PascalCase
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  const [date, setDate] = useState(new Date());

  const formattedDate = useMemo(() => formatDate(date), [date]);

  const {
    data: plannings = [],
    isLoading,
    isFetching,
    error,
  } = usePlannings(formattedDate);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themeColors.background,
      }}
    >
      <Text style={{ color: themeColors.text }}>hello missions</Text>
    </View>
  );
};

=======
import { adjustFontSize, useFontSize } from '@/app-contexts/FontSizeContext';
import { useAuthStore } from '@/app-states/AuthStore';
import { Colors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";

const { width, height } = Dimensions.get('window');

type MenuItem = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
};

const Index = () => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();
  const { fontSizeAdjustment } = useFontSize();
  const { user } = useAuthStore();
  const menuItems: MenuItem[] = [
    { id: '1', title: 'Mes missions', icon: 'briefcase', route: '/missions-supervisor/my-missions', color: '#FF6B6B' },
    { id: '2', title: 'Missions', icon: 'list', route: '/missions-supervisor/missions-list', color: '#4ECDC4' },
    { id: '3', title: 'Documents', icon: 'document-text', route: '/missions-supervisor/documents', color: '#45B7D1' },
    { id: '4', title: 'Véhicules', icon: 'car', route: '/missions-supervisor/vehicles', color: '#FFA07A' },
    { id: '5', title: "Placement d'agent", icon: 'people', route: '/missions-supervisor/agent-placement', color: '#98D8C8' },
    { id: '6', title: 'Gestion de taches', icon: 'checkbox', route: '/missions-supervisor/task-management', color: '#B19CD9' },
  ];

  const handleMenuPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: themeColors.icon, fontSize: adjustFontSize(21, fontSizeAdjustment) }]}>
          Bonjour,
        </Text>
        <Text style={[styles.userName, { fontSize: adjustFontSize(32, fontSizeAdjustment) }]}>
          {user?.full_name || 'Utilisateur'} {user?.last_name || ''}
        </Text>
      </View>

      {/* Menu Grid */}
      <View style={styles.menuGrid}>
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.menuCard,
              { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' },
              pressed && styles.menuCardPressed,
            ]}
            onPress={() => handleMenuPress(item.route)}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={32} color={item.color} />
            </View>
            <Text style={[styles.menuTitle, { color: themeColors.text, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 20,
    paddingBottom: height * 0.15,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  greeting: {
    fontWeight: '400',
    marginBottom: 8,
    opacity: 0.7,
  },
  userName: {
    fontWeight: '800',
    color: '#0a7ea4',
    letterSpacing: 0.5,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'space-between',
  },
  menuCard: {
    width: (width - 55) / 2,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuTitle: {
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
});

>>>>>>> main
export default Index;
