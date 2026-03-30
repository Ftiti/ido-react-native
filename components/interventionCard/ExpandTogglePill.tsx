import { Ionicons } from "@expo/vector-icons";
import React, { memo, useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { Tokens } from "./tokens";

interface ExpandTogglePillProps {
  expanded: boolean;
  hiddenCount: number;
  onPress: () => void;
  T: Tokens;
}

export const ExpandTogglePill = memo(
  ({ expanded, hiddenCount, onPress, T }: ExpandTogglePillProps) => {
    const tokens = T ?? {
      toggleBg: "#f8fafc",
      toggleBorder: "#cbd5e1",
      toggleDots: "#2563eb",
      toggleText: "#2563eb",
      shadowColor: "#000",
    };

    const scalePressAnim = useRef(new Animated.Value(1)).current;

    // Always keep a fresh ref to onPress so memo never captures a stale closure
    const onPressRef = useRef(onPress);
    useEffect(() => {
      onPressRef.current = onPress;
    }, [onPress]);

    const handlePressIn = () => {
      Animated.timing(scalePressAnim, {
        toValue: 0.93,
        duration: 70,
        useNativeDriver: false,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scalePressAnim, {
        toValue: 1,
        useNativeDriver: false,
        tension: 220,
        friction: 10,
      }).start();
    };

    return (
      <View style={{ alignItems: "center", marginTop: 8, marginBottom: 2 }}>
        <Animated.View style={{ transform: [{ scale: scalePressAnim }] }}>
          <TouchableOpacity
            onPress={() => {
              console.log("[Pill] onPress fired");
              onPressRef.current();
            }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.75}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 6,
              paddingHorizontal: 14,
              borderRadius: 999,
              backgroundColor: tokens.toggleBg,
              borderWidth: 1,
              borderColor: tokens.toggleBorder,
              shadowColor: tokens.shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.09,
              shadowRadius: 5,
              elevation: 2,
            }}
          >
            {/* Three horizontal dots */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: tokens.toggleDots,
                  marginRight: 3,
                }}
              />
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: tokens.toggleDots,
                  marginRight: 3,
                }}
              />
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: tokens.toggleDots,
                }}
              />
            </View>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: tokens.toggleText,
                letterSpacing: 0.1,
                marginLeft: 6,
              }}
            >
              {expanded ? "Voir moins" : `Voir ${hiddenCount} de plus`}
            </Text>

            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={12}
              color={tokens.toggleText}
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  },
);
