import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from "@/app-states/AuthStore";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFontSize, adjustFontSize } from "@/app-contexts/FontSizeContext";
import Slider from '@react-native-community/slider';
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const Index = () => {
  const router = useRouter();
  const loginStore = useAuthStore();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const { fontSizeAdjustment, setFontSizeAdjustment } = useFontSize();

  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Données du profil (non modifiables)
  const [nom] = useState("Ben Ali");
  const [prenom] = useState("Ahmed");
  const [adresse] = useState("123 Rue de la Liberté, Tunis");

  // Champs modifiables
  const [telephone, setTelephone] = useState("+216 20 123 456");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = async () => {
    loginStore.logout();
    router.replace("/(auth)");
  };

  const handleUpdatePhone = () => {
    Alert.alert("Succès", "Numéro de téléphone mis à jour");
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }
    Alert.alert("Succès", "Mot de passe modifié avec succès");
    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à la caméra');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setShowImagePicker(false);
    }
  };

  const handlePickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à la galerie');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setShowImagePicker(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Pressable onPress={() => setShowImagePicker(true)} style={styles.avatarContainer}>
            <Image source={{ uri: profileImage }} style={styles.avatar} />
            <View style={[styles.cameraIcon, { backgroundColor: colors.tint }]}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </Pressable>
          <Text style={[styles.userName, { color: colors.text, fontSize: adjustFontSize(24, fontSizeAdjustment) }]}>
            {prenom} {nom}
          </Text>
          <Text style={[styles.userRole, { color: colors.icon, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>Superviseur</Text>
          
          {/* Font Size Toggle */}
          <View style={[styles.fontSizeCard, { backgroundColor: scheme === "dark" ? "#1a1a1a" : "#fff" }]}>
            <Text style={[styles.fontSizeLabel, { color: colors.text, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>Taille de police</Text>
            <View style={styles.sliderContainer}>
              <Text style={[styles.sliderLabel, { color: colors.icon }]}>A-</Text>
              <Slider
                style={styles.slider}
                minimumValue={-4}
                maximumValue={4}
                step={2}
                value={fontSizeAdjustment}
                onValueChange={(value) => setFontSizeAdjustment(value as -4 | -2 | 0 | 2 | 4)}
                minimumTrackTintColor={colors.tint}
                maximumTrackTintColor={colors.icon + "30"}
                thumbTintColor={colors.tint}
              />
              <Text style={[styles.sliderLabel, { color: colors.icon }]}>A+</Text>
            </View>
          </View>
        </View>

        {/* Documents Section */}
        <Pressable
          style={[styles.documentsCard, { backgroundColor: scheme === "dark" ? "#1a1a1a" : "#fff" }]}
          onPress={() => router.push('/documents')}
        >
          <View style={[styles.documentIconContainer, { backgroundColor: colors.tint + "20" }]}>
            <Ionicons name="document-text" size={24} color={colors.tint} />
          </View>
          <View style={styles.documentTextContainer}>
            <Text style={[styles.documentTitle, { color: colors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>Mes Documents</Text>
            <Text style={[styles.documentSubtitle, { color: colors.icon, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
              Contrats, certifications, etc.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </Pressable>

        {/* Informations Section */}
        <View style={[styles.section, { backgroundColor: scheme === "dark" ? "#1a1a1a" : "#fff" }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>Informations Personnelles</Text>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.icon, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>Nom</Text>
            <Text style={[styles.value, { color: colors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>{nom}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.icon, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>Prénom</Text>
            <Text style={[styles.value, { color: colors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>{prenom}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.icon, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>Adresse</Text>
            <Text style={[styles.value, { color: colors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>{adresse}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.icon, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>Téléphone</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { backgroundColor: scheme === "dark" ? "#2a2a2a" : "#f5f5f5", color: colors.text }]}
                value={telephone}
                onChangeText={setTelephone}
                keyboardType="phone-pad"
              />
              <Pressable
                style={[styles.updateButton, { backgroundColor: colors.tint }]}
                onPress={handleUpdatePhone}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Password Section */}
        <Pressable
          style={[styles.section, { backgroundColor: scheme === "dark" ? "#1a1a1a" : "#fff" }]}
          onPress={() => setShowPasswordModal(true)}
        >
          <View style={styles.passwordRow}>
            <View style={styles.passwordLeft}>
              <Ionicons name="lock-closed" size={24} color={colors.tint} />
              <View style={styles.passwordText}>
                <Text style={[styles.sectionTitle, { color: colors.text, fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>Mot de passe</Text>
                <Text style={[styles.passwordSubtitle, { color: colors.icon, fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
                  Modifier votre mot de passe
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.icon} />
          </View>
        </Pressable>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={[styles.logoutText, { fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal visible={showImagePicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: scheme === "dark" ? "#1a1a1a" : "#fff" }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Changer la photo</Text>
            <Pressable style={[styles.modalButton, { borderColor: colors.icon + "30" }]} onPress={handleTakePhoto}>
              <Ionicons name="camera" size={24} color={colors.tint} />
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Prendre une photo</Text>
            </Pressable>
            <Pressable style={[styles.modalButton, { borderColor: colors.icon + "30" }]} onPress={handlePickFromGallery}>
              <Ionicons name="images" size={24} color={colors.tint} />
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Choisir de la galerie</Text>
            </Pressable>
            <Pressable
              style={[styles.modalCancelButton, { backgroundColor: colors.icon + "20" }]}
              onPress={() => setShowImagePicker(false)}
            >
              <Text style={[styles.modalCancelText, { color: colors.text }]}>Annuler</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Password Change Modal */}
      <Modal visible={showPasswordModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.passwordModal, { backgroundColor: scheme === "dark" ? "#1a1a1a" : "#fff" }]}>
            <View style={styles.passwordModalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Modifier le mot de passe</Text>
              <Pressable onPress={() => setShowPasswordModal(false)}>
                <Ionicons name="close" size={28} color={colors.icon} />
              </Pressable>
            </View>

            <View style={styles.passwordInputGroup}>
              <Text style={[styles.label, { color: colors.icon }]}>Ancien mot de passe</Text>
              <TextInput
                style={[styles.passwordInput, { backgroundColor: scheme === "dark" ? "#2a2a2a" : "#f5f5f5", color: colors.text }]}
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
                placeholder="Entrez l'ancien mot de passe"
                placeholderTextColor={colors.icon}
              />
            </View>

            <View style={styles.passwordInputGroup}>
              <Text style={[styles.label, { color: colors.icon }]}>Nouveau mot de passe</Text>
              <TextInput
                style={[styles.passwordInput, { backgroundColor: scheme === "dark" ? "#2a2a2a" : "#f5f5f5", color: colors.text }]}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Entrez le nouveau mot de passe"
                placeholderTextColor={colors.icon}
              />
            </View>

            <View style={styles.passwordInputGroup}>
              <Text style={[styles.label, { color: colors.icon }]}>Confirmer le mot de passe</Text>
              <TextInput
                style={[styles.passwordInput, { backgroundColor: scheme === "dark" ? "#2a2a2a" : "#f5f5f5", color: colors.text }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirmez le nouveau mot de passe"
                placeholderTextColor={colors.icon}
              />
            </View>

            <Pressable
              style={[styles.savePasswordButton, { backgroundColor: colors.tint }]}
              onPress={handleChangePassword}
            >
              <Text style={styles.savePasswordText}>Enregistrer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 200,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    marginBottom: 16,
  },
  fontSizeCard: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  fontSizeLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  slider: {
    flex: 1,
    height: 40,
  },
  documentsCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  documentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  documentTextContainer: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  documentSubtitle: {
    fontSize: 14,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  inputGroup: {
    marginTop: 8,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  updateButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  passwordLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  passwordText: {
    gap: 4,
  },
  passwordSubtitle: {
    fontSize: 14,
  },
  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#e53935",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalCancelButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
  passwordModal: {
    width: "90%",
    borderRadius: 16,
    padding: 20,
  },
  passwordModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  passwordInputGroup: {
    marginBottom: 20,
  },
  passwordInput: {
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
  },
  savePasswordButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  savePasswordText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
