import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { usePathname } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TabButton } from "./TabButton";
import { styles } from "./tabStyles";
import { useTabTheme } from "./useTabTheme";

const HIDDEN_ROUTES = ["chat"];
const TAB_BAR_HEIGHT = 100;

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { activeColor, inactiveColor, tabBarBackground, bottomPadding } =
    useTabTheme();
  const pathname = usePathname();
  const translateY = useSharedValue(0);

  useEffect(() => {
    const shouldHide = HIDDEN_ROUTES.some((route) => pathname.includes(route));
    translateY.value = withTiming(shouldHide ? TAB_BAR_HEIGHT : 0, {
      duration: 300,
    });
  }, [pathname]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          backgroundColor: tabBarBackground,
          paddingBottom: bottomPadding,
        },
      ]}
    >
      <View style={styles.innerContainer}>
        {state.routes.map((route, index) => {
          if (["_sitemap", "+not-found"].includes(route.name)) {
            return null;
          }

          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;

          return (
            <TabButton
              key={route.key}
              route={route}
              label={label as string}
              isFocused={state.index === index}
              navigation={navigation}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
            />
          );
        })}
      </View>
    </Animated.View>
  );
};

export default CustomTabBar;
