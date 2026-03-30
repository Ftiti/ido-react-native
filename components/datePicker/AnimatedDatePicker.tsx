import { Colors } from "@/constants/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";

type Props = {
  date: Date;
  onChange: (date: Date) => void;
};

export const AnimatedDatePicker = ({ date, onChange }: Props) => {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  const [showCalendar, setShowCalendar] = useState(false);

  const translateY = useRef(new Animated.Value(10)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const animate = () => {
    translateY.setValue(10);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    animate();
  }, [date]);

  const addDays = (days: number) => {
    const next = new Date(date);
    next.setDate(date.getDate() + days);
    onChange(next);
  };

  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.background,
            shadowColor: scheme === "dark" ? "#000" : "#000",
            shadowOpacity: scheme === "dark" ? 0.35 : 0.12,
          },
        ]}
      >
        <TouchableOpacity onPress={() => addDays(-1)} style={styles.button}>
          <Text style={[styles.arrow, { color: theme.icon }]}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowCalendar(true)}
          style={styles.centerTouchable}
        >
          <Animated.View
            style={{
              opacity,
              transform: [{ translateY }],
            }}
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.dateText, { color: theme.text }]}
            >
              {formattedDate}
            </Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => addDays(1)} style={styles.button}>
          <Text style={[styles.arrow, { color: theme.icon }]}>›</Text>
        </TouchableOpacity>
      </View>

      {showCalendar && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          themeVariant={scheme} // iOS support
          onChange={(_, selectedDate) => {
            setShowCalendar(false);
            if (selectedDate) {
              onChange(selectedDate);
            }
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 14,

    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  arrow: {
    fontSize: 26,
    fontWeight: "600",
  },
  centerTouchable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    ...(Platform.OS === "android" ? { includeFontPadding: false } : {}),
  },
});
