import { adjustFontSize, useFontSize } from '@/app-contexts/FontSizeContext';
import { Colors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

const { width } = Dimensions.get('window');

type AbsenceType = 'Repos' | 'Raison privée' | 'Maladie' | 'Congé';
type Attachment = 'image' | 'pdf' | 'none';

type AbsenceRequest = {
  id: string;
  agentName: string;
  agentInitials: string;
  dateStart: string;
  dateEnd: string;
  type: AbsenceType;
  attachment: Attachment;
};

const TYPE_COLORS: Record<AbsenceType, { bg: string; text: string }> = {
  'Repos':         { bg: '#4ECDC420', text: '#4ECDC4' },
  'Raison privée': { bg: '#B19CD920', text: '#9C7FD4' },
  'Maladie':       { bg: '#FF6B6B20', text: '#FF6B6B' },
  'Congé':         { bg: '#4CAF5020', text: '#4CAF50' },
};

const MOCK_REQUESTS: AbsenceRequest[] = [
  { id: '1', agentName: 'Ahmed Ben Ali',  agentInitials: 'AB', dateStart: '21 MAR', dateEnd: '22 MAR', type: 'Maladie',       attachment: 'image' },
  { id: '2', agentName: 'Fatima Zahra',   agentInitials: 'FZ', dateStart: '15 MAR', dateEnd: '17 MAR', type: 'Congé',         attachment: 'pdf'   },
  { id: '3', agentName: 'Mohamed Salah',  agentInitials: 'MS', dateStart: '10 MAR', dateEnd: '10 MAR', type: 'Repos',         attachment: 'none'  },
  { id: '4', agentName: 'Amira Mansour',  agentInitials: 'AM', dateStart: '18 MAR', dateEnd: '20 MAR', type: 'Raison privée', attachment: 'image' },
];

const Index = () => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  const { fontSizeAdjustment } = useFontSize();
  const router = useRouter();

  const navigateToDetail = (item: AbsenceRequest) => {
    router.push({
      pathname: '/absence-detail',
      params: {
        source: 'pending',
        agentName: item.agentName,
        agentInitials: item.agentInitials,
        dateStart: item.dateStart,
        dateEnd: item.dateEnd,
        type: item.type,
        status: 'En attente',
        attachment: item.attachment,
      },
    } as any);
  };

  const renderItem = ({ item }: { item: AbsenceRequest }) => {
    const typeColor = TYPE_COLORS[item.type];
    const avatarColor = scheme === 'dark' ? '#2a2a2a' : themeColors.tint + '20';

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' },
          pressed && styles.cardPressed,
        ]}
        onPress={() => navigateToDetail(item)}
      >
        {/* Ligne agent */}
        <View style={styles.agentRow}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={[styles.avatarText, { color: themeColors.tint, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
              {item.agentInitials}
            </Text>
          </View>
          <Text style={[styles.agentName, { color: themeColors.text, fontSize: adjustFontSize(17, fontSizeAdjustment) }]}>
            {item.agentName}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={themeColors.icon} />
        </View>

        {/* Séparateur */}
        <View style={[styles.divider, { backgroundColor: themeColors.icon + '20' }]} />

        {/* Ligne bas : date + chip type */}
        <View style={styles.bottomRow}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={18} color={themeColors.icon} />
            <Text style={[styles.dateText, { color: themeColors.icon, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
              {item.dateStart === item.dateEnd
                ? item.dateStart
                : `${item.dateStart}  –  ${item.dateEnd}`}
            </Text>
          </View>
          <View style={[styles.chip, { backgroundColor: typeColor.bg }]}>
            <Text style={[styles.chipText, { color: typeColor.text, fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
              {item.type}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.tint }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
          Demandes en cours
        </Text>
        <View style={styles.headerRight}>
          <View style={styles.countPill}>
            <Text style={[styles.countPillText, { fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
              {MOCK_REQUESTS.length}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={MOCK_REQUESTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  headerRight: { width: 36, alignItems: 'flex-end' },
  countPill: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countPillText: { color: '#fff', fontWeight: '700' },
  listContent: { padding: 16, gap: 14 },
  card: {
    width: width - 32,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardPressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  agentRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '700' },
  agentName: { fontWeight: '700', flex: 1 },
  divider: { height: 1, marginBottom: 14 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontWeight: '500' },
  chip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  chipText: { fontWeight: '600' },
});

export default Index;
