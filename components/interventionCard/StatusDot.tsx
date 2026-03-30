import { memo, useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

type StatusDotProps = {
  color: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export const StatusDot = memo(({ color, size = 12, style }: StatusDotProps) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;

    if (color === "#f59e0b") {
      pulse.setValue(1);

      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.45,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
        ]),
      );

      loop.start();
    } else {
      pulse.setValue(1);
    }

    return () => {
      loop?.stop();
    };
  }, [color, pulse]);

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderWidth: 1.5,
          borderColor: "#fff",
          transform: [{ scale: pulse }],
        },
        style,
      ]}
    />
  );
});
