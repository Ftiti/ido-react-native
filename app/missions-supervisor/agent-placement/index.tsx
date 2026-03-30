import { adjustFontSize, useFontSize } from '@/app-contexts/FontSizeContext';
import { Colors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from "react-native";

const { width } = Dimensions.get('window');

type Agent = {
  id: string;
  name: string;
  role: string;
  missions: number;
  avatarColor: string;
  initials: string;
};

const AGENTS: Agent[] = [
  { id: '1', name: 'El Hassane Seddar', role: 'Agent de sécurité', missions: 5, avatarColor: '#FF6B6B', initials: 'ES' },
  { id: '2', name: 'Sophie Martin', role: 'Chef de poste', missions: 3, avatarColor: '#4ECDC4', initials: 'SM' },
  { id: '3', name: 'Jean Dupont', role: 'Agent de sécurité', missions: 7, avatarColor: '#45B7D1', initials: 'JD' },
  { id: '4', name: 'Amina Benali', role: 'Agent cynophile', missions: 2, avatarColor: '#B19CD9', initials: 'AB' },
];

const Index = () => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  const { fontSizeAdjustment } = useFontSize();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [placed, setPlaced] = useState(false);

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#98D8C8' }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
          {"Placement d'agent"}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Date */}
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={20} color="#98D8C8" />
          <Text style={[styles.dateText, { color: themeColors.text, fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
            {formattedDate}
          </Text>
        </View>

        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' }]}>
          <Ionicons name="search" size={20} color={themeColors.icon} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}
            placeholder="Rechercher un agent..."
            placeholderTextColor={themeColors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={themeColors.icon} />
            </Pressable>
          )}
        </View>

        {/* Toggle Placé */}
        <Pressable
          style={[styles.toggleButton, { backgroundColor: placed ? '#98D8C8' : (scheme === 'dark' ? '#1a1a1a' : '#fff') }]}
          onPress={() => setPlaced(prev => !prev)}
        >
          <View style={[styles.toggleDot, { backgroundColor: placed ? '#fff' : '#98D8C8' }]} />
          <Text style={[styles.toggleText, { color: placed ? '#fff' : '#98D8C8', fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
            {placed ? 'Placé' : 'Placé'}
          </Text>
        </Pressable>

        {/* Agents list */}
        <View style={styles.agentsList}>
          {AGENTS.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).map((agent) => (
            <Pressable
              key={agent.id}
              style={({ pressed }) => [
                styles.agentCard,
                { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' },
                pressed && styles.cardPressed,
              ]}
              onPress={() => router.push(`/missions-supervisor/agent-placement/detail?agentId=${agent.id}` as any)}
            >
              {/* Avatar */}
              <View style={[styles.avatar, { backgroundColor: agent.avatarColor + '25' }]}>
                <Text style={[styles.avatarText, { color: agent.avatarColor, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
                  {agent.initials}
                </Text>
              </View>

              {/* Info */}
              <View style={styles.agentInfo}>
                <Text style={[styles.agentName, { color: themeColors.text, fontSize: adjustFontSize(15, fontSizeAdjustment) }]}>
                  {agent.name}
                </Text>
                <Text style={[styles.agentRole, { color: themeColors.icon, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                  {agent.role}
                </Text>
              </View>

              {/* Missions badge + arrow */}
              <View style={styles.agentRight}>
                <View style={[styles.missionsBadge, { backgroundColor: '#98D8C820' }]}>
                  <Text style={[styles.missionsCount, { fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
                    {agent.missions}
                  </Text>
                  <Text style={[styles.missionsLabel, { fontSize: adjustFontSize(10, fontSizeAdjustment) }]}>
                    missions
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={themeColors.icon} style={styles.chevron} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: { padding: 4 },
  headerTitle: { color: '#fff', fontWeight: '700', flex: 1, textAlign: 'center' },
  headerRight: { width: 28 },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontWeight: '500',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#98D8C8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  toggleText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dateText: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  agentsList: {
    gap: 14,
  },
  agentCard: {
    width: width - 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontWeight: '800',
  },
  agentInfo: {
    flex: 1,
    gap: 4,
  },
  agentName: {
    fontWeight: '700',
  },
  agentRole: {
    fontWeight: '400',
  },
  agentRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  missionsBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  missionsCount: {
    color: '#98D8C8',
    fontWeight: '800',
  },
  missionsLabel: {
    color: '#98D8C8',
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 2,
  },
});

export default Index;
