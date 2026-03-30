import React, { useRef, useState } from "react";
import { Animated, Dimensions, View } from "react-native";
import { AgentAvatar } from "./AgentAvatar";
import { ITEM_SLOT } from "./constants";
import { ExpandTogglePill } from "./ExpandTogglePill";
import { Tokens } from "./tokens";

interface AgentRowProps {
  agents: any[];
  subcontractorAgents?: any[];
  displayPointing: boolean;
  cardWidth: number;
  T: Tokens;
}

export const AgentRow = ({
  agents,
  subcontractorAgents = [],
  displayPointing,
  cardWidth,
  T,
}: AgentRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const [overflowHeight, setOverflowHeight] = useState(0);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);
  const expandedRef = useRef(false);
  const overflowHeightRef = useRef(0);

  const allAgents = [
    ...agents.map((a) => ({ ...a, _isSub: false })),
    ...subcontractorAgents.map((a) => ({
      ...a,
      _isSub: true,
      photo_urls: { url: null, thumb: null },
      is_driver: false,
      is_teamleader: false,
    })),
  ];

  const usableWidth =
    cardWidth > 0 ? cardWidth - 32 : Dimensions.get("window").width - 64;
  const maxPerRow = Math.max(1, Math.floor(usableWidth / ITEM_SLOT));
  const firstRow = allAgents.slice(0, maxPerRow);
  const restRows = allAgents.slice(maxPerRow);
  const hasOverflow = restRows.length > 0;

  const toggleExpand = () => {
    console.log("[AgentRow] toggleExpand called", {
      isAnimating: isAnimating.current,
      expandedRef: expandedRef.current,
      overflowHeightRef: overflowHeightRef.current,
    });

    const next = !expandedRef.current;
    expandedRef.current = next;
    setExpanded(next);

    isAnimating.current = true;

    const toValue = next ? overflowHeightRef.current : 0;
    console.log("[AgentRow] starting animation", { next, toValue });

    if (next) {
      Animated.spring(heightAnim, {
        toValue,
        useNativeDriver: false,
        tension: 55,
        friction: 10,
      }).start(({ finished }) => {
        console.log("[AgentRow] spring finished", { finished, next, toValue });
        isAnimating.current = false;
      });
    } else {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start(({ finished }) => {
        console.log("[AgentRow] timing finished", { finished, next, toValue });
        heightAnim.setValue(0);
        isAnimating.current = false;
      });
    }
  };

  return (
    <View>
      {/* First visible row */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {firstRow.map((agent, i) => (
          <AgentAvatar
            key={`first-${agent._isSub ? "s" : "a"}-${agent.id}-${i}`}
            agent={agent}
            displayPointing={displayPointing}
            delay={i * 55}
            isSubcontractor={agent._isSub}
            T={T}
          />
        ))}
      </View>

      {hasOverflow && (
        <>
          {/* Animated overflow section */}
          <Animated.View style={{ height: heightAnim, overflow: "hidden" }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {restRows.map((agent, i) => (
                <AgentAvatar
                  key={`rest-${agent._isSub ? "s" : "a"}-${agent.id}-${i}`}
                  agent={agent}
                  displayPointing={displayPointing}
                  delay={expanded ? i * 40 : 0}
                  isSubcontractor={agent._isSub}
                  T={T}
                />
              ))}
            </View>
          </Animated.View>

          {/* Hidden measurement clone */}
          <View
            style={{
              position: "absolute",
              opacity: 0,
              top: 10000,
              left: 0,
              right: 0,
            }}
            pointerEvents="none"
            onLayout={(e) => {
              const h = e.nativeEvent.layout.height;
              console.log("[AgentRow] onLayout measured", {
                h,
                prev: overflowHeightRef.current,
                isAnimating: isAnimating.current,
                expanded: expandedRef.current,
              });
              if (h > 0 && h !== overflowHeightRef.current) {
                overflowHeightRef.current = h;
                setOverflowHeight(h);
              }
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                width: usableWidth,
              }}
            >
              {restRows.map((agent, i) => (
                <AgentAvatar
                  key={`m-${agent._isSub ? "s" : "a"}-${agent.id}-${i}`}
                  agent={agent}
                  displayPointing={false}
                  delay={0}
                  isSubcontractor={agent._isSub}
                  T={T}
                />
              ))}
            </View>
          </View>

          {/* Toggle pill below rows */}
          <ExpandTogglePill
            expanded={expanded}
            hiddenCount={restRows.length}
            onPress={toggleExpand}
            T={T}
          />
        </>
      )}
    </View>
  );
};
