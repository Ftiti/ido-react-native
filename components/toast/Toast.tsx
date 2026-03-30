import React, { createContext, ReactNode, useContext, useState } from "react";
import {
    Animated,
    Dimensions,
    useColorScheme as RNColorScheme,
    StyleSheet,
    Text,
} from "react-native";

type ToastType = "success" | "error" | "info" | "warning";
type ToastPosition = "top" | "bottom" | "center";

type ToastOptions = {
  type?: ToastType;
  message: string;
  duration?: number;
  position?: ToastPosition;
  icon?: string;
};

type ToastContextType = {
  showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = RNColorScheme(); // detects system dark/light mode
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const showToast = (options: ToastOptions) => {
    setToast(options);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setToast(null));
      }, options.duration || 2000);
    });
  };

  const { width, height } = Dimensions.get("window");

  const getBackgroundColor = (type: ToastType = "info") => {
    const isDark = colorScheme === "dark";
    switch (type) {
      case "success":
        return isDark ? "#2a7a2a" : "#4BB543";
      case "error":
        return isDark ? "#8b1a1a" : "#FF3333";
      case "warning":
        return isDark ? "#805c00" : "#FFAA00";
      case "info":
      default:
        return isDark ? "#333" : "#555";
    }
  };

  const getPositionStyle = (position: ToastPosition = "top") => {
    switch (position) {
      case "top":
        return { top: 50 };
      case "center":
        return { top: height / 2 - 40 };
      case "bottom":
      default:
        return { bottom: 50 };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.toast,
            getPositionStyle(toast.position),
            {
              backgroundColor: getBackgroundColor(toast.type),
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.text}>
            {toast.icon ? `${toast.icon} ` : ""}
            {toast.message}
          </Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: width * 0.1,
    width: width * 0.8,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  text: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
  },
});
