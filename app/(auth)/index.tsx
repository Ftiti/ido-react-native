import { login, requestOtp } from "@/app-services/authService";
import { useAuthStore } from "@/app-states/AuthStore";
import { Button, InputField } from "@/components/index";
import { useToast } from "@/components/toast/Toast";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";



export default function Index() {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; phone?: string }>({});
  const { showToast } = useToast();
  const router = useRouter();

  const loginStore = useAuthStore(); // get the store instance

  const [loading, setLoading] = useState(false);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { width } = Dimensions.get("window");

  // Responsive sizing
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  const containerMaxWidth = isDesktop ? 480 : isTablet ? 600 : width * 0.9;

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (loginMethod === "email") {
      if (!email) {
        newErrors.email = "L'adresse e-mail est requise";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Adresse e-mail invalide";
      }

      if (!password) {
        newErrors.password = "Le mot de passe est requis";
      } else if (password.length < 6) {
        newErrors.password =
          "Le mot de passe doit contenir au moins 6 caractères";
      }
    } else {
      if (!phone) {
        newErrors.phone = "Le numéro de téléphone est requis";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      
      if (loginMethod === "email") {
        try {
          // Call your login API
          const response = await login(email, password);
          console.log("Login response:", response);
          // response should contain: { token, user }
          if (response?.token) {
            loginStore.login(response.user, response.token);

            // Redirect user based on their role
            if (response.user.role === "supervisor") {
              router.replace("/(tabs-supervisor)/missions");
            } else {
              router.replace("/(tabs-agent)/missions");
            }

            showToast({ message: "Connexion réussie !", type: "success" });
          } else {
            showToast({ message: "Erreur lors de la connexion", type: "error" });
          }
        } catch (error: any) {
          console.error("Login failed", error);
          showToast({ message: error?.message || "Erreur lors de la connexion", type: "error" });
        } finally {
          setLoading(false);
        }
      } else { // Phone login
        try {
          const response = await requestOtp(phone);
          if (response.success) {
            showToast({ message: "Code OTP envoyé avec succès !", type: "success" });
            router.push({ pathname: "/verify-otp", params: { phone, request_id: response.request_id } });
          }
        } catch (error: any) {
          console.error("OTP request failed", error);
          const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Impossible d'envoyer le code OTP";
          showToast({ message: errorMsg, type: "error" });
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const activeMethodStyle = {
    color: colors.tint,
    borderBottomColor: colors.tint,
    borderBottomWidth: 2,
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.formContainer, { maxWidth: containerMaxWidth }]}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.subtitle, { color: colors.icon }]}>
              Bienvenue 
            </Text>
            <Text style={[styles.subtitle, { color: colors.icon }]}>
              Connectez-vous pour continuer
            </Text>
          </View>

          {/* Method Switcher */}
          <View style={styles.methodSwitcher}>
            <Pressable onPress={() => setLoginMethod("email")} style={styles.methodButton}>
              <Text style={[styles.methodText, { color: colors.text }, loginMethod === 'email' && activeMethodStyle]}>
                Email
              </Text>
            </Pressable>
            <Pressable onPress={() => setLoginMethod("phone")} style={styles.methodButton}>
              <Text style={[styles.methodText, { color: colors.text }, loginMethod === 'phone' && activeMethodStyle]}>
                Téléphone
              </Text>
            </Pressable>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {loginMethod === "email" ? (
              <>
                <InputField
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="exemple@email.com"
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={styles.passwordContainer}>
                  <InputField
                    label="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    error={errors.password}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                    hitSlop={10}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color={colors.icon}
                    />
                  </Pressable>
                </View>
              
              </>
            ) : (
              <InputField
                label="Numéro de téléphone"
                value={phone}
                onChangeText={setPhone}
                placeholder="+33 6 12 34 56 78"
                error={errors.phone}
                keyboardType="phone-pad"
              />
            )}

            {/* Login Button */}
            <Button
              loading={loading}
              title={loginMethod === "email" ? "Se connecter" : "Recevoir le code"}
              onPress={handleSubmit}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View
                style={[styles.dividerLine, { backgroundColor: colors.icon }]}
              />
              <Text style={[styles.dividerText, { color: colors.icon }]}>
                OU
              </Text>
              <View
                style={[styles.dividerLine, { backgroundColor: colors.icon }]}
              />
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: colors.icon }]}>
                Vous n'avez pas de compte ?{" "}
              </Text>
              <Pressable>
                <Text style={[styles.signupLink, { color: colors.tint }]}>
                  Créer un compte
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  methodSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  methodButton: {
    flex: 1,
  },
  methodText: {
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 38, // Ajustez cette valeur selon la hauteur de votre label + padding
    zIndex: 1,
  },
});
