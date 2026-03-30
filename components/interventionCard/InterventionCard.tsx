import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Platform,
    View,
    useColorScheme,
} from "react-native";

import { getPointingStatus, parseTime } from "./helpers";
import { makeTokens } from "./tokens";

import { AgentRow } from "./AgentRow";
import { AnimatedText } from "./AnimatedText";
import { LogoBadge } from "./LogoBadge";
import { StatusBadge } from "./StatusBadge";

export const InterventionCard = ({
  intervention,
  displayPointing = false,
  style,
}: {
  intervention: any;
  displayPointing?: boolean;
  style?: any;
}) => {
  const scheme = useColorScheme() ?? "light";
  const T = makeTokens(scheme);

  const { intervention_name, logos, schedule } = intervention;
  const {
    started_at,
    finished_at,
    agents = [],
    subcontractors = [],
  } = schedule;

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
  }, []);

  const finishedCount = agents.filter(
    (a: any) => getPointingStatus(a.pointing_internal) === "finished",
  ).length;

  const startedCount = agents.filter(
    (a: any) => getPointingStatus(a.pointing_internal) === "started",
  ).length;

  const notStartedCount = agents.filter(
    (a: any) => getPointingStatus(a.pointing_internal) === "not_started",
  ).length;

  const nameMatch = intervention_name.match(/^(.*?)\s*\((.*?)\)\s*-\s*(.*)$/);
  const mainName = nameMatch ? nameMatch[1].trim() : intervention_name;
  const subName = nameMatch ? nameMatch[2].trim() : "";
  const location = nameMatch ? nameMatch[3].trim() : "";

  const subAgents = subcontractors.flatMap((s: any) => s.agents ?? []);

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
      {/* Header */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <LogoBadge logos={logos} name={mainName} T={T} />
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
            {mainName}
          </AnimatedText>
          <AnimatedText
            delay={130}
            style={{ fontSize: 12.5, color: T.subText, marginTop: 2 }}
          >
            {subName ? `(${subName})` : ""}
            {subName && location ? " • " : ""}
            {location}
          </AnimatedText>
        </View>
      </View>

      <View
        style={{ height: 1, backgroundColor: T.border, marginVertical: 10 }}
      />

      {/* Time + status badges */}
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
          {parseTime(started_at)} – {parseTime(finished_at)}
        </AnimatedText>

        {displayPointing && (
          <View style={{ flexDirection: "row", gap: 6 }}>
            <StatusBadge count={finishedCount} color={T.green} delay={240} />
            <StatusBadge count={startedCount} color={T.yellow} delay={300} />
            <StatusBadge count={notStartedCount} color={T.red} delay={360} />
          </View>
        )}
      </View>

      <View
        style={{ height: 1, backgroundColor: T.border, marginVertical: 10 }}
      />

      {/* Agents */}
      <AgentRow
        agents={agents}
        subcontractorAgents={subAgents}
        displayPointing={displayPointing}
        cardWidth={measuredWidth}
        T={T}
      />
    </Animated.View>
  );
};
