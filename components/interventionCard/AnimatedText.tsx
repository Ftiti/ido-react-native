import React, { memo, useEffect, useRef } from "react";
import { Animated, TextStyle } from "react-native";

interface AnimatedTextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  delay?: number;
}

export const AnimatedText = memo(
  ({ children, style, delay = 0 }: AnimatedTextProps) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 370,
        delay,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.Text
        style={[
          style,
          {
            opacity: anim,
            transform: [
              {
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [7, 0],
                }),
              },
            ],
          },
        ]}
      >
        {children}
      </Animated.Text>
    );
  },
);
