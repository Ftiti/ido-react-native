import React, { memo, useEffect, useRef } from "react";
import { Animated, Text } from "react-native";
import { StatusDot } from "./StatusDot";

export const StatusBadge = memo(
  ({
    count,
    color,
    delay = 0,
  }: {
    count: number;
    color: string;
    delay?: number;
  }) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(anim, {
        toValue: 1,
        delay,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }).start();
    }, []);

    return (
      <Animated.View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          paddingHorizontal: 9,
          paddingVertical: 5,
          borderRadius: 999,
          borderWidth: 1.5,
          borderColor: color,
          opacity: anim,
          transform: [{ scale: anim }],
        }}
      >
        <StatusDot color={color} size={9} />
        <Text style={{ fontSize: 12, fontWeight: "700", color }}>{count}</Text>
      </Animated.View>
    );
  },
);
