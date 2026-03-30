import { adjustFontSize, useFontSize } from '@/app-contexts/FontSizeContext';
import { Colors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { Dimensions, Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from "react-native";

const { width } = Dimensions.get('window');

type MaterialStatus = 'Restitué' | 'En attente de restitution';
type Category = 'Matériel' | 'Agents' | 'Consommable';

type Material = {
  id: string;
  name: string;
  date: string;
  status: MaterialStatus;
};

type Request = {
  id: string;
  agentName: string;
  materials: Material[];
};

const STATUS_COLORS: Record<MaterialStatus, { bg: string; text: string }> = {
  'Restitué': { bg: '#4CAF5020', text: '#4CAF50' },
  'En attente de restitution': { bg: '#FFA07A20', text: '#FFA07A' },
};

const MOCK_REQUESTS: Request[] = [
  {
    id: '1',
    agentName: 'El Hassane Seddar',
    materials: [
      { id: '1-1', name: 'Karchër', date: '15/11/2023', status: 'Restitué' },
      { id: '1-2', name: 'Perceuse', date: '16/11/2023', status: 'En attente de restitution' },
      { id: '1-3', name: 'Échelle', date: '17/11/2023', status: 'Restitué' },
    ],
  },
  {
    id: '2',
    agentName: 'Sophie Martin',
    materials: [
      { id: '2-1', name: 'Marteau-piqueur', date: '18/11/2023', status: 'Restitué' },
      { id: '2-2', name: 'Bétonnière', date: '19/11/2023', status: 'Restitué' },
      { id: '2-3', name: 'Scie circulaire', date: '20/11/2023', status: 'En attente de restitution' },
    ],
  },
  {
    id: '3',
    agentName: 'Jean Dupont',
    materials: [
      { id: '3-1', name: 'Compresseur', date: '21/11/2023', status: 'En attente de restitution' },
      { id: '3-2', name: 'Ponceuse', date: '22/11/2023', status: 'Restitué' },
      { id: '3-3', name: 'Meuleuse', date: '23/11/2023', status: 'Restitué' },
    ],
  },
];

const Index = () => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  const { fontSizeAdjustment } = useFontSize();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>('Matériel');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<{ material: Material; agentName: string; agentPhone: string } | null>(null);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories: Category[] = ['Matériel', 'Agents', 'Consommable'];

  const renderMaterialItem = (material: Material, agentName: string, agentPhone: string) => {
    const statusColor = STATUS_COLORS[material.status];
    return (
      <Pressable 
        key={material.id} 
        style={[styles.materialBlock, { backgroundColor: statusColor.bg }]}
        onPress={() => setSelectedMaterial({ material, agentName, agentPhone })}
      >
        <View style={styles.materialHeader}>
          <View style={styles.materialLeft}>
            <Ionicons name="cube-outline" size={18} color={statusColor.text} />
            <Text style={[styles.materialName, { color: statusColor.text, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
              {material.name}
            </Text>
          </View>
          <Text style={[styles.materialDate, { color: statusColor.text, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
            {material.date}
          </Text>
        </View>
        <Text style={[styles.materialStatus, { color: statusColor.text, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
          {material.status}
        </Text>
      </Pressable>
    );
  };

  const renderRequest = ({ item }: { item: Request }) => {
    return (
      <View style={[styles.requestCard, { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' }]}>
        <View style={styles.agentHeader}>
          <View style={[styles.agentIconContainer, { backgroundColor: themeColors.tint + '20' }]}>
            <Ionicons name="person" size={24} color={themeColors.tint} />
          </View>
          <Text style={[styles.agentName, { color: themeColors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
            {item.agentName}
          </Text>
        </View>
        <View style={styles.materialsContainer}>
          {item.materials.map((material) => renderMaterialItem(material, item.agentName, '+33 6 12 34 56 78'))}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: '#4CAF50' }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
          Demandes traitées
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Category Selector */}
        <View style={[styles.categoryCard, { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' }]}>
          <View style={styles.categoryRow}>
            {categories.map((category) => (
              <Pressable
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && { backgroundColor: themeColors.tint },
                  selectedCategory !== category && { backgroundColor: themeColors.icon + '20' },
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    { fontSize: adjustFontSize(14, fontSizeAdjustment) },
                    selectedCategory === category ? { color: '#fff' } : { color: themeColors.icon },
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchCard, { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' }]}>
          <Ionicons name="search" size={20} color={themeColors.icon} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}
            placeholder="Rechercher..."
            placeholderTextColor={themeColors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Button */}
        <Pressable style={[styles.filterButton, { backgroundColor: themeColors.tint }]}>
          <Ionicons name="filter" size={20} color="#fff" />
          <Text style={[styles.filterText, { fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>Filtrer</Text>
        </Pressable>

        {/* Requests List */}
        <View style={styles.requestsList}>
          {MOCK_REQUESTS.map((item) => (
            <View key={item.id}>{renderRequest({ item })}</View>
          ))}
        </View>
      </ScrollView>

      {/* Material Detail Modal */}
      <Modal visible={selectedMaterial !== null} transparent animationType="slide">
        <View style={styles.detailModalOverlay}>
          <View style={[styles.detailModalContent, { backgroundColor: themeColors.background }]}>
            <ScrollView contentContainerStyle={styles.detailScrollContent}>
              {/* Header */}
              <View style={styles.detailHeader}>
                <Text style={[styles.detailHeaderTitle, { color: themeColors.text, fontSize: adjustFontSize(20, fontSizeAdjustment) }]}>
                  Détails du matériel
                </Text>
                <Pressable onPress={() => setSelectedMaterial(null)}>
                  <Ionicons name="close-circle" size={32} color={themeColors.icon} />
                </Pressable>
              </View>

              {/* Agent Card */}
              <View style={[styles.agentCard, { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' }]}>
                <View style={styles.agentCardTop}>
                  <View style={[styles.agentIconLarge, { backgroundColor: themeColors.tint + '20' }]}>
                    <Ionicons name="person" size={28} color={themeColors.tint} />
                  </View>
                  <View style={styles.agentCardInfo}>
                    <Text style={[styles.agentCardName, { color: themeColors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
                      {selectedMaterial?.agentName}
                    </Text>
                    <View style={styles.agentChip}>
                      <Text style={[styles.agentChipText, { fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>Agent</Text>
                    </View>
                  </View>
                  <Pressable 
                    style={[styles.phoneButton, { backgroundColor: '#4CAF50' }]}
                    onPress={() => Linking.openURL(`tel:${selectedMaterial?.agentPhone}`)}
                  >
                    <Ionicons name="call" size={24} color="#fff" />
                  </Pressable>
                </View>
              </View>

              {/* Material Requested */}
              <Text style={[styles.sectionTitle, { color: themeColors.text, fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
                Matériel demandé
              </Text>
              {selectedMaterial && (
                <View style={[styles.materialDetailBlock, { backgroundColor: STATUS_COLORS[selectedMaterial.material.status].bg }]}>
                  <View style={styles.materialHeader}>
                    <View style={styles.materialLeft}>
                      <Ionicons name="cube-outline" size={20} color={STATUS_COLORS[selectedMaterial.material.status].text} />
                      <Text style={[styles.materialName, { color: STATUS_COLORS[selectedMaterial.material.status].text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
                        {selectedMaterial.material.name}
                      </Text>
                    </View>
                    <Text style={[styles.materialDate, { color: STATUS_COLORS[selectedMaterial.material.status].text, fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
                      {selectedMaterial.material.date}
                    </Text>
                  </View>
                  <Text style={[styles.materialStatus, { color: STATUS_COLORS[selectedMaterial.material.status].text, fontSize: adjustFontSize(13, fontSizeAdjustment) }]}>
                    {selectedMaterial.material.status}
                  </Text>
                </View>
              )}

              {/* Photos prise en charge */}
              <Text style={[styles.sectionTitle, { color: themeColors.text, fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
                Photos prise en charge
              </Text>
              <View style={styles.photosGrid}>
                {[
                  'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
                  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
                  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400'
                ].map((img, index) => (
                  <Pressable 
                    key={index} 
                    style={styles.photoItem}
                    onPress={() => {
                      setSelectedImages([
                        'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800',
                        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
                        'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800'
                      ]);
                      setCurrentImageIndex(index);
                      setShowImageGallery(true);
                    }}
                  >
                    <Image source={{ uri: img }} style={styles.photoImage} />
                  </Pressable>
                ))}
              </View>

              {/* Photos restitution */}
              <Text style={[styles.sectionTitle, { color: themeColors.text, fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
                Photos restitution (obligatoire)
              </Text>
              <View style={styles.photosGrid}>
                {[
                  'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400',
                  'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400'
                ].map((img, index) => (
                  <Pressable 
                    key={index} 
                    style={styles.photoItem}
                    onPress={() => {
                      setSelectedImages([
                        'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800',
                        'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800'
                      ]);
                      setCurrentImageIndex(index);
                      setShowImageGallery(true);
                    }}
                  >
                    <Image source={{ uri: img }} style={styles.photoImage} />
                  </Pressable>
                ))}
              </View>

              {/* Remarque */}
              <Text style={[styles.sectionTitle, { color: themeColors.text, fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
                Remarque
              </Text>
              <View style={styles.remarqueBlock}>
                <View style={styles.remarqueHeader}>
                  <Ionicons name="information-circle" size={20} color="#FF9800" />
                  <Text style={[styles.remarqueTitle, { fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>Note importante</Text>
                </View>
                <Text style={[styles.remarqueText, { fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
                  {"Le matériel doit être restitué en bon état. Toute dégradation sera facturée à l'agent. Merci de vérifier l'état avant utilisation."}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Image Gallery Modal */}
      <Modal visible={showImageGallery} transparent animationType="fade">
        <View style={styles.galleryOverlay}>
          <Pressable style={styles.galleryCloseButton} onPress={() => setShowImageGallery(false)}>
            <Ionicons name="close-circle" size={40} color="#fff" />
          </Pressable>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
          >
            {selectedImages.map((img, index) => (
              <View key={index} style={styles.galleryImageContainer}>
                <Image source={{ uri: img }} style={styles.galleryImage} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>
          <View style={styles.galleryCounter}>
            <Text style={[styles.galleryCounterText, { fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
              {currentImageIndex + 1} / {selectedImages.length}
            </Text>
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
  scrollContent: { padding: 16, gap: 16 },
  categoryCard: {
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryRow: { flexDirection: 'row', gap: 8 },
  categoryButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  categoryText: { fontWeight: '600' },
  searchCard: {
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
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'center',
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: { color: '#fff', fontWeight: '600' },
  requestsList: { gap: 16 },
  requestCard: {
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  agentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentName: { fontWeight: '700' },
  materialsContainer: { gap: 10 },
  materialBlock: {
    borderRadius: 10,
    padding: 12,
  },
  materialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  materialLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  materialName: { fontWeight: '700' },
  materialDate: { fontWeight: '500' },
  materialStatus: { fontWeight: '600', marginLeft: 26 },
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  detailModalContent: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  detailScrollContent: {
    padding: 20,
    gap: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailHeaderTitle: {
    fontWeight: '700',
  },
  agentCard: {
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  agentCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  agentIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentCardInfo: {
    flex: 1,
    gap: 6,
  },
  agentCardName: {
    fontWeight: '700',
  },
  agentChip: {
    backgroundColor: '#0a7ea420',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  agentChipText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  phoneButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },
  materialDetailBlock: {
    borderRadius: 12,
    padding: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoItem: {
    width: (width - 60) / 3,
    height: (width - 60) / 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  remarqueBlock: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  remarqueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  remarqueTitle: {
    color: '#FF9800',
    fontWeight: '700',
  },
  remarqueText: {
    color: '#E65100',
    lineHeight: 20,
  },
  galleryOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
  },
  galleryCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  galleryImageContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImage: {
    width: '90%',
    height: '80%',
  },
  galleryCounter: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  galleryCounterText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Index;
