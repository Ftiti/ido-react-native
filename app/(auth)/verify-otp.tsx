import { useAuthStore } from "@/app-states/AuthStore";
import { Button, InputField } from "@/components/index";
import { useToast } from "@/components/toast/Toast";
import { Colors } from "@/constants/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { verifyOtp } from "@/app-services/authService";
import { Ionicons } from "@expo/vector-icons";

export default function VerifyOtpScreen() {
  const { phone, request_id } = useLocalSearchParams<{ phone: string; request_id: string }>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const router = useRouter();
  const { showToast } = useToast();
  const loginStore = useAuthStore();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      setError("Veuillez entrer un code valide à 6 chiffres.");
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      const response = await verifyOtp(phone, otp, request_id);

      if (response?.token) {
        loginStore.login(response.user, response.token);
        showToast({ message: "Connexion réussie !", type: "success" });

        if (response.user.role === "supervisor") {
          router.replace("/(tabs-supervisor)/missions");
        } else {
          router.replace("/(tabs-agent)/missions");
        }
      } else {
        setError("Code OTP invalide.");
        showToast({ message: "Code OTP invalide.", type: "error" });
      }
    } catch (err: any) {
      const errorCode = err?.response?.data?.error;
      let errorMessage = "La vérification a échoué.";
      
      if (errorCode === "invalid_code") {
        errorMessage = "Code invalide. Vérifiez et réessayez.";
      } else if (errorCode === "expired_code") {
        errorMessage = "Code expiré. Demandez un nouveau code.";
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      showToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Vérification</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Entrez le code à 6 chiffres envoyé au {phone}
          </Text>
        </View>

        <InputField
          label="Code OTP"
          value={otp}
          onChangeText={setOtp}
          placeholder="123456"
          error={error}
          keyboardType="numeric"
          maxLength={6}
        />

        <Button loading={loading} title="Vérifier et se connecter" onPress={handleVerify} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  formContainer: {
    width: "100%",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});
