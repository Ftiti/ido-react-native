import { adjustFontSize, useFontSize } from '@/app-contexts/FontSizeContext';
import { Colors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from "react";
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";

const { width } = Dimensions.get('window');

type AbsenceType = 'Repos' | 'Raison privée' | 'Maladie' | 'Congé';
type AbsenceStatus = 'En attente' | 'Acceptée' | 'Refusée';
type Source = 'my' | 'pending' | 'treated';
type Attachment = 'image' | 'pdf' | 'none';

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  'Repos':         { bg: '#4ECDC420', text: '#4ECDC4' },
  'Raison privée': { bg: '#B19CD920', text: '#9C7FD4' },
  'Maladie':       { bg: '#FF6B6B20', text: '#FF6B6B' },
  'Congé':         { bg: '#45B7D120', text: '#45B7D1' },
};

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  'En attente': { bg: '#FFA07A20', text: '#FFA07A', icon: 'time-outline' },
  'Acceptée':   { bg: '#4CAF5020', text: '#4CAF50', icon: 'checkmark-circle' },
  'Refusée':    { bg: '#FF6B6B20', text: '#FF6B6B', icon: 'close-circle' },
};

const HEADER_COLORS: Record<Source, string> = {
  my:      '#FF6B6B',
  pending: '#45B7D1',
  treated: '#4CAF50',
};

const Index = () => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  const { fontSizeAdjustment } = useFontSize();
  const router = useRouter();

  const params = useLocalSearchParams<{
    source: Source;
    agentName: string;
    agentInitials: string;
    dateStart: string;
    dateEnd: string;
    type: string;
    status: string;
    attachment: Attachment;
  }>();

  const {
    source = 'pending',
    agentName = '',
    agentInitials = '',
    dateStart = '',
    dateEnd = '',
    type = '',
    status = '',
    attachment = 'none',
  } = params;

  const isPending = source === 'pending';
  const isMy = source === 'my';
  const cardBg = scheme === 'dark' ? '#1a1a1a' : '#fff';
  const headerColor = HEADER_COLORS[source as Source] ?? '#45B7D1';
  const typeColor = TYPE_COLORS[type] ?? { bg: '#eee', text: '#888' };
  const statusColor = STATUS_COLORS[status];
  const dateLabel = dateStart === dateEnd ? dateStart : `${dateStart}  –  ${dateEnd}`;

  const handleAccept = () => {
    Alert.alert('Confirmé', 'La demande a été acceptée.');
    router.back();
  };

  const handleReject = () => {
    Alert.alert('Confirmé', 'La demande a été rejetée.');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
          Détail de la demande
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Agent (sauf "mes demandes") */}
        {!isMy && (
          <View style={[styles.agentCard, { backgroundColor: cardBg }]}>
            <View style={[styles.agentAvatar, { backgroundColor: headerColor + '25' }]}>
              <Text style={[styles.agentInitials, { color: headerColor, fontSize: adjustFontSize(20, fontSizeAdjustment) }]}>
                {agentInitials}
              </Text>
            </View>
            <View style={styles.agentInfo}>
              <Text style={[styles.agentLabel, { color: themeColors.icon, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                Agent
              </Text>
              <Text style={[styles.agentName, { color: themeColors.text, fontSize: adjustFontSize(17, fontSizeAdjustment) }]}>
                {agentName}
              </Text>
            </View>
            {statusColor && (
              <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                <Ionicons name={statusColor.icon as any} size={14} color={statusColor.text} />
                <Text style={[styles.statusBadgeText, { color: statusColor.text, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                  {status}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Boutons Message + Appeler (sauf "mes demandes") */}
        {!isMy && (
          <View style={styles.actionRow}>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, { backgroundColor: cardBg }, pressed && styles.btnPressed]}
              onPress={() => Alert.alert('Message', `Envoyer un message à ${agentName}`)}
            >
              <View style={[styles.actionBtnIcon, { backgroundColor: '#45B7D120' }]}>
                <Ionicons name="chatbubble-outline" size={22} color="#45B7D1" />
              </View>
              <Text style={[styles.actionBtnText, { color: themeColors.text, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
                Message
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, { backgroundColor: cardBg }, pressed && styles.btnPressed]}
              onPress={() => Alert.alert('Appeler', `Appeler ${agentName}`)}
            >
              <View style={[styles.actionBtnIcon, { backgroundColor: '#4CAF5020' }]}>
                <Ionicons name="call-outline" size={22} color="#4CAF50" />
              </View>
              <Text style={[styles.actionBtnText, { color: themeColors.text, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
                Appeler
              </Text>
            </Pressable>
          </View>
        )}

        {/* Bloc Jours */}
        <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
          <View style={[styles.infoIconBg, { backgroundColor: '#45B7D120' }]}>
            <Ionicons name="calendar-outline" size={22} color="#45B7D1" />
          </View>
          <Text style={[styles.infoLabel, { color: themeColors.icon, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
            Jours
          </Text>
          <Text style={[styles.infoValue, { color: themeColors.text, fontSize: adjustFontSize(15, fontSizeAdjustment) }]}>
            {dateLabel}
          </Text>
        </View>

        {/* Bloc Motif */}
        <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
          <View style={[styles.infoIconBg, { backgroundColor: '#B19CD920' }]}>
            <Ionicons name="document-text-outline" size={22} color="#9C7FD4" />
          </View>
          <Text style={[styles.infoLabel, { color: themeColors.icon, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
            Motif
          </Text>
          <View style={[styles.motifChip, { backgroundColor: typeColor.bg }]}>
            <Text style={[styles.motifChipText, { color: typeColor.text, fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
              {type}
            </Text>
          </View>
        </View>

        {/* Bloc Pièce jointe */}
        <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
          <View style={[styles.infoIconBg, { backgroundColor: '#FFA07A20' }]}>
            <Ionicons name="attach-outline" size={22} color="#FFA07A" />
          </View>
          <Text style={[styles.infoLabel, { color: themeColors.icon, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
            Pièce jointe
          </Text>
          {attachment === 'image' && (
            <View style={styles.attachmentContent}>
              <Ionicons name="image-outline" size={24} color="#45B7D1" />
              <Text style={[styles.attachmentText, { color: '#45B7D1', fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
                Image jointe
              </Text>
            </View>
          )}
          {attachment === 'pdf' && (
            <View style={styles.attachmentContent}>
              <Ionicons name="document-outline" size={24} color="#FF6B6B" />
              <Text style={[styles.attachmentText, { color: '#FF6B6B', fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
                Document PDF
              </Text>
            </View>
          )}
          {attachment === 'none' && (
            <Text style={[styles.noAttachment, { color: themeColors.icon, fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
              Pas de pièce jointe
            </Text>
          )}
        </View>

        {/* Boutons Accepter / Rejeter (seulement "en cours") */}
        {isPending && (
          <View style={styles.decisionRow}>
            <Pressable
              style={({ pressed }) => [styles.rejectBtn, pressed && styles.btnPressed]}
              onPress={handleReject}
            >
              <Ionicons name="close-circle-outline" size={20} color="#fff" />
              <Text style={[styles.decisionBtnText, { fontSize: adjustFontSize(15, fontSizeAdjustment) }]}>
                Rejeter
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.acceptBtn, pressed && styles.btnPressed]}
              onPress={handleAccept}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={[styles.decisionBtnText, { fontSize: adjustFontSize(15, fontSizeAdjustment) }]}>
                Accepter
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  // Agent card
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  agentAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentInitials: {
    fontWeight: '800',
  },
  agentInfo: {
    flex: 1,
    gap: 2,
  },
  agentLabel: {
    fontWeight: '500',
  },
  agentName: {
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusBadgeText: {
    fontWeight: '600',
  },
  // Boutons action Message / Appeler
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontWeight: '600',
  },
  btnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  // Blocs info
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  infoIconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontWeight: '600',
    width: 60,
  },
  infoValue: {
    flex: 1,
    fontWeight: '500',
    textAlign: 'right',
  },
  motifChip: {
    marginLeft: 'auto',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  motifChipText: {
    fontWeight: '700',
  },
  attachmentContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  attachmentText: {
    fontWeight: '600',
  },
  noAttachment: {
    flex: 1,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  // Boutons décision
  decisionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    paddingVertical: 16,
  },
  acceptBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    paddingVertical: 16,
  },
  decisionBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default Index;