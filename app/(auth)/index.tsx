import { login } from "@/app-services/authService";
import { useAuthStore } from "@/app-states/auth/AuthStore";
import { Button, InputField } from "@/components/index";
import { useToast } from "@/components/toast/Toast";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const { showToast } = useToast();
  const router = useRouter();

  const loginStore = useAuthStore(); // get the store instance

  const [loading, setLoading] = useState(false);

  const colorScheme = useColorScheme();
  const colors = Colors[(colorScheme as "light" | "dark") ?? "light"];
  const { width } = Dimensions.get("window");

  // Responsive sizing
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  const containerMaxWidth = isDesktop ? 480 : isTablet ? 600 : width * 0.9;

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        // Call your login API
        const response = await login(email, password);
        // response should contain: { token, user }
        if (response?.token) {
          loginStore.login(response.user, response.token);

          // Set token on Axios for future API calls
          response.user.role == "supervisor"
            ? router.replace("/(tabs-supervisor)/missions")
            : (response.user.role == "punctual" ||
                response.user.role == "regular" ||
                response.user.role == "agent") &&
              router.replace("/(tabs-agent)/missions");

          showToast({ message: "Connexion réussie !", type: "success" });
        } else {
          showToast({ message: "Erreur lors de la connexion", type: "error" });
        }
        // Save user and token in the store
      } catch (error: any) {
        console.error("Login failed", error);
        // showToast(error?.message || "Erreur lors de la connexion", "error");
      } finally {
        setLoading(false);
      }
    }
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
            <Text style={[styles.title, { color: colors.text }]}>
              Connexion
            </Text>
            <Text style={[styles.subtitle, { color: colors.icon }]}>
              Bienvenue ! Connectez-vous pour continuer
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="exemple@email.com"
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <InputField
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              error={errors.password}
              secureTextEntry={!showPassword}
              showSecureToggle={true}
              onToggleSecure={() => setShowPassword(!showPassword)}
            />

            {/* Forgot Password */}
            <Pressable style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: colors.tint }]}>
                Mot de passe oublié ?
              </Text>
            </Pressable>

            {/* Login Button */}
            <Button
              loading={loading}
              title="Se connecter"
              onPress={handleLogin}
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
});
