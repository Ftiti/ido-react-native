import { Colors } from "@/constants/theme";
import React from "react";
import { Text, useColorScheme, View, StyleSheet, Pressable, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFontSize, adjustFontSize } from '@/app-contexts/FontSizeContext';

const { width } = Dimensions.get('window');

const Index = () => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();
  const { fontSizeAdjustment } = useFontSize();

  const pendingCount = 3;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: themeColors.text, fontSize: adjustFontSize(28, fontSizeAdjustment) }]}>
          Matériel
        </Text>
      </View>

      {/* Cards Container */}
      <View style={styles.cardsContainer}>
        {/* Demandes en cours */}
        <Pressable
          style={({ pressed }) => [
            styles.card,
            { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' },
            pressed && styles.cardPressed,
          ]}
          onPress={() => router.push('/pending-materials')}
        >
          <View style={styles.cardTop}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFA07A20' }]}>
              <Ionicons name="time-outline" size={32} color="#FFA07A" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: themeColors.text, fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
                Demandes en cours
              </Text>
              <Text style={[styles.cardSubtitle, { color: themeColors.icon, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
                {pendingCount} demandes en attente
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={themeColors.icon} />
          </View>
        </Pressable>

        {/* Demandes traitées */}
        <Pressable
          style={({ pressed }) => [
            styles.card,
            { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' },
            pressed && styles.cardPressed,
          ]}
          onPress={() => router.push('/processed-materials')}
        >
          <View style={styles.cardTop}>
            <View style={[styles.iconContainer, { backgroundColor: '#4CAF5020' }]}>
              <Ionicons name="checkmark-done-outline" size={32} color="#4CAF50" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: themeColors.text, fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
                Demandes traitées
              </Text>
              <Text style={[styles.cardSubtitle, { color: themeColors.icon, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
                Voir la liste
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={themeColors.icon} />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontWeight: '700',
  },
  cardsContainer: {
    padding: 20,
    gap: 16,
  },
  card: {
    width: width - 40,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontWeight: '500',
  },
});

export default Index;
