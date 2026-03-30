import { useEffect, useRef } from "react";
import { Animated, Easing, ViewStyle } from "react-native";

type Props = {
  visible: boolean;
  style?: ViewStyle;
};

export const RefreshSpinner = ({ visible, style }: Props) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      animRef.current = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );

      animRef.current.start();
    } else {
      animRef.current?.stop();
      rotation.setValue(0);

      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      animRef.current?.stop();
    };
  }, [visible]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        {
          opacity,
          height: 24,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          borderWidth: 2,
          borderColor: "#ddd",
          borderTopColor: "#888",
          transform: [{ rotate: spin }],
        }}
      />
    </Animated.View>
  );
};
