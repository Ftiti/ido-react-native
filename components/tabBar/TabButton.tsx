import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { getTabIcon } from "./tabIcons";
import { styles } from "./tabStyles";

interface Props {
  route: any;
  label: string;
  isFocused: boolean;
  navigation: any;
  activeColor: string;
  inactiveColor: string;
}

export const TabButton: React.FC<Props> = ({
  route,
  label,
  isFocused,
  navigation,
  activeColor,
  inactiveColor,
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
  }));

  const iconColor = isFocused ? activeColor : inactiveColor;

  return (
    <TouchableOpacity
      style={styles.tabItem}
      activeOpacity={0.6}
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
    >
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        {getTabIcon(route.name, iconColor)}
      </Animated.View>

      <Animated.Text
        style={[styles.text, labelAnimatedStyle, { color: iconColor }]}
        numberOfLines={1}
        ellipsizeMode="clip"
      >
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
};
