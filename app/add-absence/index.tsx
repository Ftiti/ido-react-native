import DateTimePicker from '@react-native-community/datetimepicker';
import { adjustFontSize, useFontSize } from '@/app-contexts/FontSizeContext';
import { Colors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

type AbsenceType = 'Repos' | 'Raison privée' | 'Maladie' | 'Congé';

const TYPES: { label: AbsenceType; icon: string; color: string; bg: string }[] = [
  { label: 'Maladie',       icon: 'medkit-outline',       color: '#FF6B6B', bg: '#FF6B6B20' },
  { label: 'Congé',         icon: 'sunny-outline',        color: '#45B7D1', bg: '#45B7D120' },
  { label: 'Repos',         icon: 'moon-outline',         color: '#4ECDC4', bg: '#4ECDC420' },
  { label: 'Raison privée', icon: 'lock-closed-outline',  color: '#9C7FD4', bg: '#B19CD920' },
];

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉC'];
  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const Index = () => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  const { fontSizeAdjustment } = useFontSize();
  const router = useRouter();

  const [selectedType, setSelectedType] = useState<AbsenceType | null>(null);
  const [dateDebut, setDateDebut] = useState<Date>(new Date());
  const [dateFin, setDateFin] = useState<Date>(new Date());
  const [showPickerDebut, setShowPickerDebut] = useState(false);
  const [showPickerFin, setShowPickerFin] = useState(false);
  const [attachment, setAttachment] = useState<'image' | 'pdf' | null>(null);

  const cardBg = scheme === 'dark' ? '#1a1a1a' : '#fff';

  const handleSubmit = () => {
    if (!selectedType) {
      Alert.alert('Erreur', 'Veuillez sélectionner un motif.');
      return;
    }
    if (dateFin < dateDebut) {
      Alert.alert('Erreur', 'La date de fin doit être après la date de début.');
      return;
    }
    Alert.alert('Succès', 'Votre demande a été envoyée avec succès.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const selectedTypeData = TYPES.find(t => t.label === selectedType);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#FF6B6B' }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
          Nouvelle demande
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Section Motif */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#B19CD920' }]}>
              <Ionicons name="document-text-outline" size={18} color="#9C7FD4" />
            </View>
            <Text style={[styles.sectionTitle, { color: themeColors.text, fontSize: adjustFontSize(15, fontSizeAdjustment) }]}>
              Motif de l&apos;absence
            </Text>
          </View>
          <View style={styles.typesGrid}>
            {TYPES.map((t) => {
              const isSelected = selectedType === t.label;
              return (
                <Pressable
                  key={t.label}
                  style={[
                    styles.typeCard,
                    { backgroundColor: isSelected ? t.color : cardBg },
                    isSelected && styles.typeCardSelected,
                  ]}
                  onPress={() => setSelectedType(t.label)}
                >
                  <View style={[styles.typeCardIcon, { backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : t.bg }]}>
                    <Ionicons name={t.icon as any} size={24} color={isSelected ? '#fff' : t.color} />
                  </View>
                  <Text style={[
                    styles.typeCardLabel,
                    { color: isSelected ? '#fff' : themeColors.text, fontSize: adjustFontSize(13, fontSizeAdjustment) },
                  ]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Section Période */}
        <View style={[styles.periodCard, { backgroundColor: cardBg }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#45B7D120' }]}>
              <Ionicons name="calendar-outline" size={18} color="#45B7D1" />
            </View>
            <Text style={[styles.sectionTitle, { color: themeColors.text, fontSize: adjustFontSize(15, fontSizeAdjustment) }]}>
              Période
            </Text>
          </View>

          {/* Date début */}
          <Pressable
            style={[styles.dateField, { backgroundColor: scheme === 'dark' ? '#2a2a2a' : '#f5f7fa' }]}
            onPress={() => setShowPickerDebut(true)}
          >
            <Ionicons name="calendar" size={20} color="#45B7D1" />
            <View style={styles.dateFieldText}>
              <Text style={[styles.dateFieldLabel, { color: themeColors.icon, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                Date de début
              </Text>
              <Text style={[styles.dateFieldValue, { color: themeColors.text, fontSize: adjustFontSize(15, fontSizeAdjustment) }]}>
                {formatDate(dateDebut)}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color={themeColors.icon} />
          </Pressable>

          {/* Séparateur */}
          <View style={[styles.dateSeparator, { backgroundColor: themeColors.icon + '20' }]} />

          {/* Date fin */}
          <Pressable
            style={[styles.dateField, { backgroundColor: scheme === 'dark' ? '#2a2a2a' : '#f5f7fa' }]}
            onPress={() => setShowPickerFin(true)}
          >
            <Ionicons name="calendar" size={20} color="#45B7D1" />
            <View style={styles.dateFieldText}>
              <Text style={[styles.dateFieldLabel, { color: themeColors.icon, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                Date de fin
              </Text>
              <Text style={[styles.dateFieldValue, { color: themeColors.text, fontSize: adjustFontSize(15, fontSizeAdjustment) }]}>
                {formatDate(dateFin)}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color={themeColors.icon} />
          </Pressable>
        </View>

        {/* DateTimePicker Début */}
        {showPickerDebut && (
          <DateTimePicker
            value={dateDebut}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            onChange={(_, date) => {
              setShowPickerDebut(false);
              if (date) setDateDebut(date);
            }}
          />
        )}

        {/* DateTimePicker Fin */}
        {showPickerFin && (
          <DateTimePicker
            value={dateFin}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={dateDebut}
            onChange={(_, date) => {
              setShowPickerFin(false);
              if (date) setDateFin(date);
            }}
          />
        )}

        {/* Section Pièce jointe */}
        <View style={[styles.attachmentCard, { backgroundColor: cardBg }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FFA07A20' }]}>
              <Ionicons name="attach-outline" size={18} color="#FFA07A" />
            </View>
            <Text style={[styles.sectionTitle, { color: themeColors.text, fontSize: adjustFontSize(15, fontSizeAdjustment) }]}>
              Pièce jointe
              <Text style={[styles.optionalLabel, { color: themeColors.icon, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                {' '}(optionnel)
              </Text>
            </Text>
          </View>

          <View style={styles.attachmentBtns}>
            <Pressable
              style={[
                styles.attachmentBtn,
                { backgroundColor: attachment === 'image' ? '#45B7D1' : (scheme === 'dark' ? '#2a2a2a' : '#f5f7fa') },
              ]}
              onPress={() => setAttachment(attachment === 'image' ? null : 'image')}
            >
              <Ionicons name="image-outline" size={22} color={attachment === 'image' ? '#fff' : '#45B7D1'} />
              <Text style={[styles.attachmentBtnText, {
                color: attachment === 'image' ? '#fff' : themeColors.text,
                fontSize: adjustFontSize(13, fontSizeAdjustment),
              }]}>
                Image
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.attachmentBtn,
                { backgroundColor: attachment === 'pdf' ? '#FF6B6B' : (scheme === 'dark' ? '#2a2a2a' : '#f5f7fa') },
              ]}
              onPress={() => setAttachment(attachment === 'pdf' ? null : 'pdf')}
            >
              <Ionicons name="document-outline" size={22} color={attachment === 'pdf' ? '#fff' : '#FF6B6B'} />
              <Text style={[styles.attachmentBtnText, {
                color: attachment === 'pdf' ? '#fff' : themeColors.text,
                fontSize: adjustFontSize(13, fontSizeAdjustment),
              }]}>
                PDF
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Résumé si type sélectionné */}
        {selectedType && selectedTypeData && (
          <View style={[styles.summaryCard, { backgroundColor: selectedTypeData.color + '15', borderColor: selectedTypeData.color + '40' }]}>
            <Ionicons name="information-circle-outline" size={20} color={selectedTypeData.color} />
            <Text style={[styles.summaryText, { color: selectedTypeData.color, fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
              Demande de <Text style={{ fontWeight: '700' }}>{selectedType}</Text> du{' '}
              <Text style={{ fontWeight: '700' }}>{formatDate(dateDebut)}</Text> au{' '}
              <Text style={{ fontWeight: '700' }}>{formatDate(dateFin)}</Text>
            </Text>
          </View>
        )}

        {/* Bouton Envoyer */}
        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            { backgroundColor: selectedType ? '#FF6B6B' : themeColors.icon + '60' },
            pressed && styles.submitBtnPressed,
          ]}
          onPress={handleSubmit}
        >
          <Ionicons name="send-outline" size={20} color="#fff" />
          <Text style={[styles.submitBtnText, { fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
            Envoyer la demande
          </Text>
        </Pressable>

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
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  sectionIconBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontWeight: '700',
  },
  optionalLabel: {
    fontWeight: '400',
  },
  // Section motif
  section: {
    gap: 0,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  typeCardSelected: {
    shadowOpacity: 0.2,
    elevation: 6,
  },
  typeCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeCardLabel: {
    fontWeight: '600',
    textAlign: 'center',
  },
  // Période
  periodCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  dateFieldText: {
    flex: 1,
    gap: 2,
  },
  dateFieldLabel: {
    fontWeight: '500',
  },
  dateFieldValue: {
    fontWeight: '700',
  },
  dateSeparator: {
    height: 1,
    marginVertical: 10,
  },
  // Pièce jointe
  attachmentCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  attachmentBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  attachmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 14,
  },
  attachmentBtnText: {
    fontWeight: '600',
  },
  // Résumé
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  summaryText: {
    flex: 1,
    lineHeight: 20,
  },
  // Bouton soumettre
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 16,
    paddingVertical: 17,
    marginTop: 4,
  },
  submitBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default Index;