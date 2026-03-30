import { adjustFontSize, useFontSize } from '@/app-contexts/FontSizeContext';
import { Colors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

const { width } = Dimensions.get('window');

type AbsenceType = 'Repos' | 'Raison privée' | 'Maladie' | 'Congé';
type AbsenceStatus = 'Acceptée' | 'Refusée';
type Attachment = 'image' | 'pdf' | 'none';

type AbsenceRequest = {
  id: string;
  agentName: string;
  agentInitials: string;
  dateStart: string;
  dateEnd: string;
  type: AbsenceType;
  status: AbsenceStatus;
  attachment: Attachment;
};

const TYPE_COLORS: Record<AbsenceType, { bg: string; text: string }> = {
  'Repos':         { bg: '#4ECDC420', text: '#4ECDC4' },
  'Raison privée': { bg: '#B19CD920', text: '#9C7FD4' },
  'Maladie':       { bg: '#FF6B6B20', text: '#FF6B6B' },
  'Congé':         { bg: '#4CAF5020', text: '#4CAF50' },
};

const STATUS_COLORS: Record<AbsenceStatus, { bg: string; text: string; icon: string }> = {
  'Acceptée': { bg: '#4CAF5020', text: '#4CAF50', icon: 'checkmark-circle' },
  'Refusée':  { bg: '#FF6B6B20', text: '#FF6B6B', icon: 'close-circle' },
};

const MOCK_REQUESTS: AbsenceRequest[] = [
  { id: '1', agentName: 'Ahmed Ben Ali',  agentInitials: 'AB', dateStart: '01 FÉV', dateEnd: '03 FÉV', type: 'Congé',         status: 'Acceptée', attachment: 'pdf'   },
  { id: '2', agentName: 'Fatima Zahra',   agentInitials: 'FZ', dateStart: '10 FÉV', dateEnd: '10 FÉV', type: 'Repos',         status: 'Refusée',  attachment: 'none'  },
  { id: '3', agentName: 'Mohamed Salah',  agentInitials: 'MS', dateStart: '14 FÉV', dateEnd: '16 FÉV', type: 'Maladie',       status: 'Acceptée', attachment: 'image' },
  { id: '4', agentName: 'Amira Mansour',  agentInitials: 'AM', dateStart: '20 FÉV', dateEnd: '22 FÉV', type: 'Raison privée', status: 'Refusée',  attachment: 'none'  },
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
        source: 'treated',
        agentName: item.agentName,
        agentInitials: item.agentInitials,
        dateStart: item.dateStart,
        dateEnd: item.dateEnd,
        type: item.type,
        status: item.status,
        attachment: item.attachment,
      },
    } as any);
  };

  const renderItem = ({ item }: { item: AbsenceRequest }) => {
    const typeColor = TYPE_COLORS[item.type];
    const statusColor = STATUS_COLORS[item.status];
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

        {/* Ligne bas : date + chips */}
        <View style={styles.bottomRow}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={18} color={themeColors.icon} />
            <Text style={[styles.dateText, { color: themeColors.icon, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
              {item.dateStart === item.dateEnd
                ? item.dateStart
                : `${item.dateStart}  –  ${item.dateEnd}`}
            </Text>
          </View>
          <View style={styles.chipsRow}>
            <View style={[styles.chip, { backgroundColor: typeColor.bg }]}>
              <Text style={[styles.chipText, { color: typeColor.text, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                {item.type}
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: statusColor.bg }]}>
              <Ionicons name={statusColor.icon as any} size={13} color={statusColor.text} />
              <Text style={[styles.chipText, { color: statusColor.text, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#4CAF50' }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
          Demandes traitées
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
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontWeight: '500' },
  chipsRow: { flexDirection: 'row', gap: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipText: { fontWeight: '600' },
});

export default Index;