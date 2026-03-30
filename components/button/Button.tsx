import { Colors } from "@/constants/theme";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getButtonStyle = () => {
    if (disabled) {
      return {
        backgroundColor: colors.icon,
      };
    }
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.tint,
        };
      case "secondary":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.tint,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
        };
      default:
        return {
          backgroundColor: colors.tint,
        };
    }
  };

  const getTextStyle = () => {
    if (variant === "ghost") {
      return { color: colors.tint };
    }
    return { color: variant === "secondary" ? colors.tint : "#FFFFFF" };
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle()]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={[styles.buttonText, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
//   return (
//     <TouchableOpacity
//       style={[styles.button, getButtonStyle()]}
//       onPress={onPress}
//       disabled={disabled}
//       activeOpacity={0.8}
//     >
//       <Text style={[styles.buttonText, getTextStyle()]}>{title}</Text>
//     </TouchableOpacity>
//   );

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Button;
