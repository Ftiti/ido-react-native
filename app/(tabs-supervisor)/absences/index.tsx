import { adjustFontSize, useFontSize } from '@/app-contexts/FontSizeContext';
import { Colors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";

const { width } = Dimensions.get('window');

const Index = () => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  const { fontSizeAdjustment } = useFontSize();
  const router = useRouter();

  // Mock data - à remplacer avec les vraies données
  const myRequestsCount = 3;
  const pendingCount = 5;
  const treatedCount = 12;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Titre de la page */}
      <Text style={[styles.pageTitle, { color: themeColors.text, fontSize: adjustFontSize(26, fontSizeAdjustment) }]}>
        Mes absences
      </Text>

      {/* Card pleine largeur - Mes demandes d'absences */}
      <Pressable
        style={({ pressed }) => [
          styles.myRequestsCard,
          { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' },
          pressed && styles.cardPressed,
        ]}
        onPress={() => router.push('/my-absences')}
      >
        <View style={[styles.myRequestsIconBg, { backgroundColor: '#FF6B6B20' }]}>
          <Ionicons name="calendar-outline" size={34} color="#FF6B6B" />
        </View>
        <View style={styles.myRequestsInfo}>
          <Text style={[styles.myRequestsTitle, { color: themeColors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
            Mes demandes d&apos;absences
          </Text>
          <Text style={[styles.myRequestsSubtitle, { color: themeColors.icon, fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
            Suivre mes demandes
          </Text>
        </View>
        <View style={styles.myRequestsRight}>
          <View style={[styles.countBadge, { backgroundColor: '#FF6B6B' }]}>
            <Text style={[styles.countText, { fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
              {myRequestsCount}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={themeColors.icon} style={styles.chevron} />
        </View>
      </Pressable>

      {/* Séparateur + titre section */}
      <Text style={[styles.sectionTitle, { color: themeColors.text, fontSize: adjustFontSize(20, fontSizeAdjustment) }]}>
        Absences à gérer
      </Text>

      {/* Card - Demandes en cours */}
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' },
          pressed && styles.cardPressed,
        ]}
        onPress={() => router.push('/absences-pending')}
      >
        <View style={[styles.cardIconBg, { backgroundColor: '#45B7D120' }]}>
          <Ionicons name="time-outline" size={28} color="#45B7D1" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: themeColors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
            Demandes en cours
          </Text>
        </View>
        <View style={styles.cardRight}>
          <View style={[styles.countBadge, { backgroundColor: '#45B7D1' }]}>
            <Text style={[styles.countText, { fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
              {pendingCount}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={themeColors.icon} style={styles.chevron} />
        </View>
      </Pressable>

      {/* Card - Demandes traitées */}
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' },
          pressed && styles.cardPressed,
        ]}
        onPress={() => router.push('/absences-treated')}
      >
        <View style={[styles.cardIconBg, { backgroundColor: '#4CAF5020' }]}>
          <Ionicons name="checkmark-circle-outline" size={28} color="#4CAF50" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: themeColors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
            Demandes traitées
          </Text>
          <Text style={[styles.cardSubtitle, { color: themeColors.icon, fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
            Voir la liste
          </Text>
        </View>
        <View style={styles.cardRight}>
          <View style={[styles.countBadge, { backgroundColor: '#4CAF50' }]}>
            <Text style={[styles.countText, { fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
              {treatedCount}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={themeColors.icon} style={styles.chevron} />
        </View>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  pageTitle: {
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  // Card pleine largeur
  myRequestsCard: {
    width: width - 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  myRequestsIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  myRequestsInfo: {
    flex: 1,
  },
  myRequestsTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  myRequestsSubtitle: {
    opacity: 0.7,
  },
  myRequestsRight: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  // Titre de section
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  // Cards standards
  card: {
    width: width - 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
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
  cardIconBg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  cardSubtitle: {
    opacity: 0.7,
    fontWeight: '400',
  },
  cardRight: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  // Badge compteur
  countBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countText: {
    color: '#fff',
    fontWeight: '700',
  },
  chevron: {
    marginLeft: 6,
  },
});

export default Index;