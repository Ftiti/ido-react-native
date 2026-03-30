import { adjustFontSize, useFontSize } from '@/app-contexts/FontSizeContext';
import { Colors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from "react";
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from "react-native";

const { width } = Dimensions.get('window');

const AGENTS_DATA: Record<string, { name: string; role: string; avatarColor: string; initials: string; missionsCount: number }> = {
  '1': { name: 'El Hassane Seddar', role: 'Agent de sécurité', avatarColor: '#FF6B6B', initials: 'ES', missionsCount: 5 },
  '2': { name: 'Sophie Martin',     role: 'Chef de poste',     avatarColor: '#4ECDC4', initials: 'SM', missionsCount: 3 },
  '3': { name: 'Jean Dupont',       role: 'Agent de sécurité', avatarColor: '#45B7D1', initials: 'JD', missionsCount: 7 },
  '4': { name: 'Amina Benali',      role: 'Agent cynophile',   avatarColor: '#B19CD9', initials: 'AB', missionsCount: 2 },
};

type MissionCard = {
  id: string;
  company: string;
  address: string;
  type: string;
  agentsDone: number;
  agentsTotal: number;
  distance: string;
  logoColor: string;
  logoInitials: string;
};

const AVAILABLE_MISSIONS: MissionCard[] = [
  {
    id: '1',
    company: 'COGEDIM',
    address: '23 Rue Jean Jaurès\nChampigny sur marne',
    type: 'Nettoyage en intervention ponctuelle',
    agentsDone: 4, agentsTotal: 4, distance: '1,7 km',
    logoColor: '#45B7D1', logoInitials: 'CG',
  },
  {
    id: '2',
    company: 'NEXITY',
    address: '12 Avenue de la République\nParis 11e',
    type: 'Surveillance en intervention régulière',
    agentsDone: 2, agentsTotal: 6, distance: '3,2 km',
    logoColor: '#FF6B6B', logoInitials: 'NX',
  },
  {
    id: '3',
    company: 'BOUYGUES',
    address: '5 Boulevard Haussmann\nParis 9e',
    type: 'Gardiennage en intervention ponctuelle',
    agentsDone: 1, agentsTotal: 3, distance: '5,0 km',
    logoColor: '#4CAF50', logoInitials: 'BY',
  },
];

const Index = () => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  const { fontSizeAdjustment } = useFontSize();
  const router = useRouter();
  const { agentId } = useLocalSearchParams<{ agentId: string }>();

  const agent = AGENTS_DATA[agentId ?? '1'] ?? AGENTS_DATA['1'];

  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredMissions = AVAILABLE_MISSIONS.filter(m =>
    m.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#98D8C8' }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
          Affecter une mission
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Agent card */}
        <View style={[styles.agentCard, { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' }]}>
          <View style={[styles.avatar, { backgroundColor: agent.avatarColor + '25' }]}>
            <Text style={[styles.avatarText, { color: agent.avatarColor, fontSize: adjustFontSize(22, fontSizeAdjustment) }]}>
              {agent.initials}
            </Text>
          </View>
          <View style={styles.agentInfo}>
            <Text style={[styles.agentName, { color: themeColors.text, fontSize: adjustFontSize(17, fontSizeAdjustment) }]}>
              {agent.name}
            </Text>
            <View style={styles.roleChip}>
              <Text style={[styles.roleChipText, { fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                {agent.role}
              </Text>
            </View>
          </View>
          <View style={[styles.missionsBadge, { backgroundColor: '#98D8C820' }]}>
            <Text style={[styles.missionsCount, { color: '#98D8C8', fontSize: adjustFontSize(20, fontSizeAdjustment) }]}>
              {agent.missionsCount}
            </Text>
            <Text style={[styles.missionsLabel, { color: '#98D8C8', fontSize: adjustFontSize(10, fontSizeAdjustment) }]}>
              missions
            </Text>
          </View>
        </View>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: themeColors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
          Missions ponctuels disponibles
        </Text>

        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' }]}>
          <Ionicons name="search" size={20} color={themeColors.icon} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}
            placeholder="Rechercher une mission..."
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

        {/* Date */}
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={18} color="#98D8C8" />
          <Text style={[styles.dateText, { color: themeColors.text, fontSize: adjustFontSize(17, fontSizeAdjustment) }]}>
            {formattedDate}
          </Text>
        </View>

        {/* Mission cards with checkbox */}
        <View style={styles.missionsList}>
          {filteredMissions.map((mission) => {
            const isSelected = selected.includes(mission.id);
            return (
              <Pressable
                key={mission.id}
                style={[
                  styles.missionCard,
                  { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' },
                  isSelected && { borderWidth: 2, borderColor: '#98D8C8' },
                ]}
                onPress={() => toggleSelect(mission.id)}
              >
                {/* Checkbox */}
                <View style={[styles.checkbox, { borderColor: isSelected ? '#98D8C8' : themeColors.icon + '60', backgroundColor: isSelected ? '#98D8C8' : 'transparent' }]}>
                  {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>

                {/* Logo + company + address */}
                <View style={styles.missionBody}>
                  <View style={styles.missionTop}>
                    <View style={[styles.companyLogo, { backgroundColor: mission.logoColor + '20' }]}>
                      <Text style={[styles.companyLogoText, { color: mission.logoColor, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
                        {mission.logoInitials}
                      </Text>
                    </View>
                    <View style={styles.companyInfo}>
                      <Text style={[styles.companyName, { color: themeColors.text, fontSize: adjustFontSize(15, fontSizeAdjustment) }]}>
                        {mission.company}
                      </Text>
                      <Text style={[styles.companyAddress, { color: themeColors.icon, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                        {mission.address}
                      </Text>
                    </View>
                  </View>

                  {/* Type chip full width */}
                  <View style={[styles.typeChip, { backgroundColor: '#98D8C815' }]}>
                    <Text style={[styles.typeChipText, { color: '#98D8C8', fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                      {mission.type}
                    </Text>
                  </View>

                  {/* Footer */}
                  <View style={styles.missionFooter}>
                    <View style={styles.agentsRow}>
                      <Ionicons name="people-outline" size={16} color={themeColors.icon} />
                      <Text style={[styles.agentsText, { color: themeColors.icon, fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
                        {mission.agentsDone}/{mission.agentsTotal} agents
                      </Text>
                    </View>
                    <View style={[styles.distanceChip, { backgroundColor: themeColors.icon + '15' }]}>
                      <Ionicons name="location-outline" size={13} color={themeColors.icon} />
                      <Text style={[styles.distanceText, { color: themeColors.icon, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                        {mission.distance}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Affecter button */}
        <Pressable
          style={({ pressed }) => [
            styles.affecterButton,
            { backgroundColor: selected.length > 0 ? '#98D8C8' : themeColors.icon + '40' },
            pressed && { opacity: 0.8 },
          ]}
          disabled={selected.length === 0}
          onPress={() => setShowConfirm(true)}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={[styles.affecterButtonText, { fontSize: adjustFontSize(15, fontSizeAdjustment) }]}>
            {selected.length > 0 ? `Affecter (${selected.length})` : 'Affecter'}
          </Text>
        </Pressable>

      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={showConfirm} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
            <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>

              {/* Title */}
              <Text style={[styles.modalTitle, { color: themeColors.text, fontSize: adjustFontSize(17, fontSizeAdjustment) }]}>
                {"Confirmation de l'affectation de l'agent"}
              </Text>

              {/* Agent block — même design que la page */}
              <View style={[styles.agentCard, { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' }]}>
                <View style={[styles.avatar, { backgroundColor: agent.avatarColor + '25' }]}>
                  <Text style={[styles.avatarText, { color: agent.avatarColor, fontSize: adjustFontSize(22, fontSizeAdjustment) }]}>
                    {agent.initials}
                  </Text>
                </View>
                <View style={styles.agentInfo}>
                  <Text style={[styles.agentName, { color: themeColors.text, fontSize: adjustFontSize(17, fontSizeAdjustment) }]}>
                    {agent.name}
                  </Text>
                  <View style={styles.roleChip}>
                    <Text style={[styles.roleChipText, { fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                      {agent.role}
                    </Text>
                  </View>
                </View>
                <View style={[styles.missionsBadge, { backgroundColor: '#98D8C820' }]}>
                  <Text style={[styles.missionsCount, { color: '#98D8C8', fontSize: adjustFontSize(20, fontSizeAdjustment) }]}>
                    {agent.missionsCount}
                  </Text>
                  <Text style={[styles.missionsLabel, { color: '#98D8C8', fontSize: adjustFontSize(10, fontSizeAdjustment) }]}>
                    missions
                  </Text>
                </View>
              </View>

              {/* Selected missions — même design que la page */}
              <View style={styles.missionsList}>
                {AVAILABLE_MISSIONS.filter(m => selected.includes(m.id)).map((mission) => (
                  <View
                    key={mission.id}
                    style={[styles.missionCard, { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff', borderWidth: 2, borderColor: '#98D8C8' }]}
                  >
                    <View style={[styles.checkbox, { borderColor: '#98D8C8', backgroundColor: '#98D8C8' }]}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                    <View style={styles.missionBody}>
                      <View style={styles.missionTop}>
                        <View style={[styles.companyLogo, { backgroundColor: mission.logoColor + '20' }]}>
                          <Text style={[styles.companyLogoText, { color: mission.logoColor, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
                            {mission.logoInitials}
                          </Text>
                        </View>
                        <View style={styles.companyInfo}>
                          <Text style={[styles.companyName, { color: themeColors.text, fontSize: adjustFontSize(15, fontSizeAdjustment) }]}>
                            {mission.company}
                          </Text>
                          <Text style={[styles.companyAddress, { color: themeColors.icon, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                            {mission.address}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.typeChip, { backgroundColor: '#98D8C815' }]}>
                        <Text style={[styles.typeChipText, { color: '#98D8C8', fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                          {mission.type}
                        </Text>
                      </View>
                      <View style={styles.missionFooter}>
                        <View style={styles.agentsRow}>
                          <Ionicons name="people-outline" size={16} color={themeColors.icon} />
                          <Text style={[styles.agentsText, { color: themeColors.icon, fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
                            {mission.agentsDone}/{mission.agentsTotal} agents
                          </Text>
                        </View>
                        <View style={[styles.distanceChip, { backgroundColor: themeColors.icon + '15' }]}>
                          <Ionicons name="location-outline" size={13} color={themeColors.icon} />
                          <Text style={[styles.distanceText, { color: themeColors.icon, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                            {mission.distance}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Buttons */}
              <View style={styles.modalButtons}>
                <Pressable
                  style={({ pressed }) => [styles.cancelButton, { borderColor: themeColors.icon + '50' }, pressed && { opacity: 0.7 }]}
                  onPress={() => setShowConfirm(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: themeColors.icon, fontSize: adjustFontSize(15, fontSizeAdjustment) }]}>
                    Annuler
                  </Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.confirmButton, pressed && { opacity: 0.8 }]}
                  onPress={() => { setShowConfirm(false); router.back(); }}
                >
                  <Text style={[styles.confirmButtonText, { fontSize: adjustFontSize(15, fontSizeAdjustment) }]}>
                    Confirmer
                  </Text>
                </Pressable>
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>

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
  scrollContent: { padding: 20, paddingBottom: 40, gap: 18 },

  // Agent card
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: { fontWeight: '800' },
  agentInfo: { flex: 1, gap: 6 },
  agentName: { fontWeight: '700' },
  roleChip: {
    backgroundColor: '#98D8C820',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  roleChipText: { color: '#98D8C8', fontWeight: '600' },
  missionsBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  missionsCount: { fontWeight: '800' },
  missionsLabel: { fontWeight: '500', marginTop: 2 },

  // Subtitle
  subtitle: {
    fontWeight: '700',
    textAlign: 'center',
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: { flex: 1, fontWeight: '500' },

  // Date
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dateText: { fontWeight: '800', letterSpacing: 0.5 },

  // Missions
  missionsList: { gap: 14 },
  missionCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  missionBody: { flex: 1, gap: 12 },
  missionTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyLogoText: { fontWeight: '800' },
  companyInfo: { flex: 1, gap: 4 },
  companyName: { fontWeight: '700' },
  companyAddress: { fontWeight: '400', lineHeight: 18 },
  typeChip: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  typeChipText: { fontWeight: '600' },
  missionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  agentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  agentsText: { fontWeight: '500' },
  distanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  distanceText: { fontWeight: '600' },

  // Affecter button
  affecterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  affecterButtonText: { color: '#fff', fontWeight: '700' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalScroll: {
    padding: 24,
    gap: 18,
  },
  modalTitle: {
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 10,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelButtonText: { fontWeight: '600' },
  confirmButton: {
    flex: 1,
    backgroundColor: '#98D8C8',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: { color: '#fff', fontWeight: '700' },
});

export default Index;