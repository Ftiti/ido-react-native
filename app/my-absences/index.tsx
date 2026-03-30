import { adjustFontSize, useFontSize } from '@/app-contexts/FontSizeContext';
import { Colors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

const { width } = Dimensions.get('window');

type AbsenceType = 'Repos' | 'Raison privée' | 'Maladie' | 'Congé';
type AbsenceStatus = 'En attente' | 'Acceptée' | 'Refusée';
type Attachment = 'image' | 'pdf' | 'none';

type MyAbsenceRequest = {
  id: string;
  dateStart: string;
  dateEnd: string;
  type: AbsenceType;
  status: AbsenceStatus;
  attachment: Attachment;
};

const TYPE_COLORS: Record<AbsenceType, { bg: string; text: string; icon: string }> = {
  'Repos':         { bg: '#4ECDC420', text: '#4ECDC4', icon: 'moon-outline' },
  'Raison privée': { bg: '#B19CD920', text: '#9C7FD4', icon: 'lock-closed-outline' },
  'Maladie':       { bg: '#FF6B6B20', text: '#FF6B6B', icon: 'medkit-outline' },
  'Congé':         { bg: '#45B7D120', text: '#45B7D1', icon: 'sunny-outline' },
};

const STATUS_COLORS: Record<AbsenceStatus, { bg: string; text: string; icon: string }> = {
  'En attente': { bg: '#FFA07A20', text: '#FFA07A', icon: 'time-outline' },
  'Acceptée':   { bg: '#4CAF5020', text: '#4CAF50', icon: 'checkmark-circle' },
  'Refusée':    { bg: '#FF6B6B20', text: '#FF6B6B', icon: 'close-circle' },
};

const MOCK_REQUESTS: MyAbsenceRequest[] = [
  { id: '1', dateStart: '21 MAR', dateEnd: '22 MAR', type: 'Maladie',       status: 'En attente', attachment: 'image' },
  { id: '2', dateStart: '01 AVR', dateEnd: '05 AVR', type: 'Congé',         status: 'Acceptée',   attachment: 'pdf'  },
  { id: '3', dateStart: '10 AVR', dateEnd: '10 AVR', type: 'Repos',         status: 'Refusée',    attachment: 'none' },
  { id: '4', dateStart: '20 AVR', dateEnd: '21 AVR', type: 'Raison privée', status: 'En attente', attachment: 'none' },
];

const Index = () => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  const { fontSizeAdjustment } = useFontSize();
  const router = useRouter();

  const navigateToDetail = (item: MyAbsenceRequest) => {
    router.push({
      pathname: '/absence-detail',
      params: {
        source: 'my',
        dateStart: item.dateStart,
        dateEnd: item.dateEnd,
        type: item.type,
        status: item.status,
        attachment: item.attachment,
      },
    } as any);
  };

  const renderItem = ({ item }: { item: MyAbsenceRequest }) => {
    const typeColor = TYPE_COLORS[item.type];
    const statusColor = STATUS_COLORS[item.status];

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' },
          pressed && styles.cardPressed,
        ]}
        onPress={() => navigateToDetail(item)}
      >
        {/* Ligne type avec icône */}
        <View style={styles.typeRow}>
          <View style={[styles.typeIconBg, { backgroundColor: typeColor.bg }]}>
            <Ionicons name={typeColor.icon as any} size={26} color={typeColor.text} />
          </View>
          <Text style={[styles.typeLabel, { color: typeColor.text, fontSize: adjustFontSize(17, fontSizeAdjustment) }]}>
            {item.type}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={themeColors.icon} />
        </View>

        {/* Séparateur */}
        <View style={[styles.divider, { backgroundColor: themeColors.icon + '20' }]} />

        {/* Ligne bas : date + chip statut */}
        <View style={styles.bottomRow}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={18} color={themeColors.icon} />
            <Text style={[styles.dateText, { color: themeColors.icon, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
              {item.dateStart === item.dateEnd
                ? item.dateStart
                : `${item.dateStart}  –  ${item.dateEnd}`}
            </Text>
          </View>
          <View style={[styles.statusChip, { backgroundColor: statusColor.bg }]}>
            <Ionicons name={statusColor.icon as any} size={13} color={statusColor.text} />
            <Text style={[styles.statusText, { color: statusColor.text, fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
              {item.status}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#FF6B6B' }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
          Mes demandes d&apos;absences
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

      {/* Floating Add Button */}
      <Pressable
        style={({ pressed }) => [
          styles.floatingButton,
          { backgroundColor: '#FF6B6B' },
          pressed && styles.floatingButtonPressed,
        ]}
        onPress={() => router.push('/add-absence')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
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
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  typeIconBg: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  typeLabel: { fontWeight: '700', flex: 1 },
  divider: { height: 1, marginBottom: 14 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontWeight: '500' },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusText: { fontWeight: '600' },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});

export default Index;