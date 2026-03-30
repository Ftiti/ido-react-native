import { adjustFontSize, useFontSize } from '@/app-contexts/FontSizeContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

let DocumentPicker: any = null;
try {
  DocumentPicker = require('expo-document-picker');
} catch (e) {
  // expo-document-picker not available in Expo Go
}

const Colors = {
  light: {
    text: '#11181C',
    background: '#f5f5f5',
    tint: '#0a7ea4',
    icon: '#687076',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#0a7ea4',
    icon: '#9BA1A6',
  },
};

type DocumentType = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  uploaded: boolean;
  fileUri?: string;
  fileType?: 'image' | 'pdf';
};

export default function DocumentsScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const { fontSizeAdjustment } = useFontSize();

  const [documents, setDocuments] = useState<DocumentType[]>([
    { id: '1', name: 'Carte BTP', icon: 'card', uploaded: false },
    { id: '2', name: "Pièce d'identité", icon: 'person-circle', uploaded: false },
    { id: '3', name: 'Carte Grise', icon: 'car', uploaded: false },
    { id: '4', name: 'Assurance Véhicule', icon: 'shield-checkmark', uploaded: false },
    { id: '5', name: 'Mutuelle', icon: 'medical', uploaded: false },
    { id: '6', name: 'Sécurité Sociale', icon: 'fitness', uploaded: false },
    { id: '7', name: 'RIB', icon: 'wallet', uploaded: false },
  ]);

  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);

  const handlePickDocument = async () => {
    if (!DocumentPicker) {
      Alert.alert(
        'Non disponible',
        'Le sélecteur de PDF n\'est pas disponible avec Expo Go. Vous pouvez prendre une photo du document à la place.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Prendre une photo', onPress: handleTakePhoto },
        ]
      );
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success' && selectedDoc) {
        const isPdf = result.name?.toLowerCase().endsWith('.pdf') || result.mimeType === 'application/pdf';
        updateDocument(selectedDoc.id, result.uri, isPdf ? 'pdf' : 'image');
        setShowPickerModal(false);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner le document');
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à la caméra');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && selectedDoc) {
      updateDocument(selectedDoc.id, result.assets[0].uri, 'image');
      setShowPickerModal(false);
    }
  };

  const handlePickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à la galerie');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && selectedDoc) {
      updateDocument(selectedDoc.id, result.assets[0].uri, 'image');
      setShowPickerModal(false);
    }
  };

  const updateDocument = (id: string, uri: string, type: 'image' | 'pdf') => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === id ? { ...doc, uploaded: true, fileUri: uri, fileType: type } : doc
      )
    );
  };

  const openUploadPicker = (doc: DocumentType) => {
    setSelectedDoc(doc);
    setShowPickerModal(true);
  };

  const viewDocument = (doc: DocumentType) => {
    if (doc.uploaded && doc.fileUri) {
      if (doc.fileType === 'pdf') {
        Linking.openURL(doc.fileUri);
      } else {
        setSelectedDoc(doc);
        setShowImageModal(true);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.tint }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>Mes Documents</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {documents.map((doc) => (
          <View
            key={doc.id}
            style={[styles.docCard, { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' }]}
          >
            <View style={styles.docLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                <Ionicons name={doc.icon} size={28} color={colors.tint} />
              </View>
              <View style={styles.docInfo}>
                <Text style={[styles.docName, { color: colors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
                  {doc.name}
                </Text>
                <View style={styles.statusRow}>
                  {doc.uploaded ? (
                    <>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                      <Text style={[styles.statusText, { color: '#4CAF50', fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                        Téléchargé
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="alert-circle" size={16} color="#FF9800" />
                      <Text style={[styles.statusText, { color: '#FF9800', fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>
                        En attente
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.docActions}>
              {doc.uploaded && (
                <Pressable
                  style={[styles.actionButton, { backgroundColor: colors.tint + '20' }]}
                  onPress={() => viewDocument(doc)}
                >
                  <Ionicons name="eye" size={20} color={colors.tint} />
                </Pressable>
              )}
              <Pressable
                style={[styles.actionButton, { backgroundColor: colors.tint + '20' }]}
                onPress={() => openUploadPicker(doc)}
              >
                <Ionicons name={doc.uploaded ? "refresh" : "cloud-upload"} size={20} color={colors.tint} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal visible={showPickerModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: colors.text, fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>
              {selectedDoc?.uploaded ? 'Modifier le document' : 'Ajouter le document'}
            </Text>
            <Pressable
              style={[styles.modalButton, { borderColor: colors.icon + '30' }]}
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera" size={24} color={colors.tint} />
              <Text style={[styles.modalButtonText, { color: colors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
                Prendre une photo
              </Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, { borderColor: colors.icon + '30' }]}
              onPress={handlePickFromGallery}
            >
              <Ionicons name="images" size={24} color={colors.tint} />
              <Text style={[styles.modalButtonText, { color: colors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
                Choisir depuis la galerie
              </Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, { borderColor: colors.icon + '30' }]}
              onPress={handlePickDocument}
            >
              <Ionicons name="document" size={24} color={colors.tint} />
              <Text style={[styles.modalButtonText, { color: colors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
                Choisir un document PDF
              </Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, { borderColor: '#ff4444' }]}
              onPress={() => setShowPickerModal(false)}
            >
              <Ionicons name="close" size={24} color="#ff4444" />
              <Text style={[styles.modalButtonText, { color: '#ff4444', fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
                Annuler
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Image View Modal */}
      <Modal visible={showImageModal} transparent animationType="fade">
        <View style={styles.imageModalOverlay}>
          <Pressable style={styles.closeImageButton} onPress={() => setShowImageModal(false)}>
            <Ionicons name="close-circle" size={40} color="#fff" />
          </Pressable>
          {selectedDoc?.fileUri && selectedDoc.fileType === 'image' && (
            <Image source={{ uri: selectedDoc.fileUri }} style={styles.fullImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '600',
  },
  placeholder: {
    width: 34,
  },
  scrollContent: {
    padding: 15,
    gap: 12,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  docLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docInfo: {
    flex: 1,
    gap: 4,
  },
  docName: {
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontWeight: '500',
  },
  docActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalButtonText: {
    fontWeight: '500',
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeImageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  fullImage: {
    width: '90%',
    height: '80%',
  },
});
