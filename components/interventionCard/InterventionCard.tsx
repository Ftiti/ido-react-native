import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleProp,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";

import { AgentRow } from "./AgentRow";
import { AnimatedText } from "./AnimatedText";
import { LogoBadge } from "./LogoBadge";
import { makeTokens } from "./tokens";

type Props = {
  intervention: any;
  displayPointing?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const InterventionCard = ({
  intervention: planning,
  displayPointing = false,
  style,
}: Props) => {
  const scheme = (useColorScheme() ?? "light") as "light" | "dark";
  const T = makeTokens(scheme);

  const cardAnim = useRef(new Animated.Value(0)).current;
  const [measuredWidth, setMeasuredWidth] = useState(
    Dimensions.get("window").width - 32,
  );

  useEffect(() => {
    Animated.spring(cardAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 48,
      friction: 9,
    }).start();
  }, [cardAnim]);

  const startedAtLabel =
    planning.display_started_at == null
      ? "--:--"
      : new Date(planning.display_started_at).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });

  const finishedAtLabel =
    planning.display_finished_at == null
      ? "--:--"
      : new Date(planning.display_finished_at).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });

  return (
    <Animated.View
      onLayout={(e) => setMeasuredWidth(e.nativeEvent.layout.width)}
      style={[
        {
          backgroundColor: T.cardBg,
          borderRadius: 20,
          padding: 16,
          marginBottom: 20,
          ...Platform.select({
            ios: {
              shadowColor: T.shadowColor,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: scheme === "dark" ? 0.6 : 0.11,
              shadowRadius: 18,
            },
            android: { elevation: 8 },
          }),
          borderWidth: scheme === "dark" ? 1 : 0,
          borderColor: T.cardBorder,
        },
        style,
        {
          opacity: cardAnim,
          transform: [
            {
              scale: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
            {
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <LogoBadge name={planning.main_name ?? "Client"} T={T} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <AnimatedText
            delay={80}
            style={{
              fontSize: 16,
              fontWeight: "800",
              color: T.text,
              letterSpacing: -0.3,
            }}
          >
            {planning.main_name ?? "Client"}
          </AnimatedText>

          <AnimatedText
            delay={130}
            style={{ fontSize: 12.5, color: T.subText, marginTop: 2 }}
          >
            {planning.sub_name ? `(${planning.sub_name})` : ""}
            {planning.sub_name && planning.location ? " • " : ""}
            {planning.location ?? ""}
          </AnimatedText>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <AnimatedText
          delay={190}
          style={{
            backgroundColor: T.primaryLight,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            fontSize: 13,
            color: T.primaryText,
            fontWeight: "700",
          }}
        >
          {"⏰  "}
          {startedAtLabel} – {finishedAtLabel}
        </AnimatedText>
        <AnimatedText
          delay={190}
          style={{
            backgroundColor: T.primaryLight,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            fontSize: 13,
            color: T.primaryText,
            fontWeight: "700",
          }}
        >
          {planning.prestation}
        </AnimatedText>
      </View>

      <View
        style={{ height: 1, backgroundColor: T.border, marginVertical: 10 }}
      />

      <AgentRow
        agents={planning.planning_agents ?? []}
        subcontractorAgents={planning.subcontractor_agents ?? []}
        displayPointing={displayPointing}
        cardWidth={measuredWidth}
        T={T}
      />
    </Animated.View>
  );
};
