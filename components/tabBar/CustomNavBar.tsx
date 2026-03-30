import { Colors } from "@/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const CustomNavBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  // WhatsApp-inspired design with blue accent
  const backgroundColor = scheme === "dark" ? "#0B141A" : "#F0F2F5";
  const activeColor = scheme === "dark" ? "#53BDEB" : "#0086EA";
  const inactiveColor = scheme === "dark" ? "#8696A0" : "#667781";
  const tabBarBackground = scheme === "dark" ? "#1F2C34" : "#FFFFFF";

  // Calculate bottom padding - accounting for Android navigation buttons
  const bottomPadding = Platform.select({
    ios: Math.max(insets.bottom, 8) + 8,
    android: Math.max(insets.bottom + 12, 16),
    default: 16,
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: tabBarBackground,
          paddingBottom: bottomPadding,
        },
      ]}
    >
      <View style={styles.innerContainer}>
        {state.routes.map((route, index) => {
          if (["_sitemap", "+not-found"].includes(route.name)) return null;

          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          return (
            <TabButton
              key={route.key}
              route={route}
              label={label as string}
              isFocused={isFocused}
              navigation={navigation}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
              scheme={scheme ?? "light"}
            />
          );
        })}
      </View>
    </View>
  );
};

interface TabButtonProps {
  route: any;
  label: string;
  isFocused: boolean;
  navigation: any;
  activeColor: string;
  inactiveColor: string;
  scheme: "light" | "dark" | null;
}

const TabButton: React.FC<TabButtonProps> = ({
  route,
  label,
  isFocused,
  navigation,
  activeColor,
  inactiveColor,
  scheme,
}) => {
  const scale = useSharedValue(1);
  const labelOpacity = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.05 : 1, {
      damping: 20,
      stiffness: 220,
    });
    labelOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 150 });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const labelAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: labelOpacity.value,
    };
  });

  const iconColor = isFocused ? activeColor : inactiveColor;

  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={() => {
        Haptics.selectionAsync();

        const event = navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });
        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name, route.params);
        }
      }}
      activeOpacity={0.6}
    >
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        {getIconByRouteName(route.name, iconColor)}
      </Animated.View>
      <Animated.Text
        style={[
          styles.text,
          labelAnimatedStyle,
          {
            color: isFocused ? activeColor : inactiveColor,
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="clip"
      >
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
};

function getIconByRouteName(routeName: string, color: string) {
  switch (routeName) {
    case "missions":
      return (
        <MaterialCommunityIcons name="dots-grid" size={24} color={color} />
      );
    case "chat":
      return (
        <Ionicons name="chatbox-ellipses-outline" size={24} color={color} />
      );
    case "absences":
      return (
        <MaterialCommunityIcons
          name="account-cancel-outline"
          size={24}
          color={color}
        />
      );
    case "materials":
      return (
        <MaterialCommunityIcons
          name="package-variant-closed"
          size={24}
          color={color}
        />
      );
    case "profil":
      return <MaterialIcons name="account-circle" size={24} color={color} />;
    default:
      return <Feather name="home" size={24} color={color} />;
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    paddingTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0, 0, 0, 0.08)",
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  tabItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingVertical: 6,
    gap: 2,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 28,
    height: 28,
  },
  text: {
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0,
    textAlign: "center",
    maxWidth: 80,
  },
});

export default CustomNavBar;
