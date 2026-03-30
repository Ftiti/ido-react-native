import { useMemo, useRef, useState } from "react";
import { Animated, Dimensions, View } from "react-native";
import { AgentAvatar } from "./AgentAvatar";
import { ITEM_SLOT } from "./constants";
import { ExpandTogglePill } from "./ExpandTogglePill";
import { Tokens } from "./tokens";

type RowAgent = {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  phone: string | null;
  email: string | null;
  job?: string | null;
  post?: string | null;
  photo_urls: {
    url: string | null;
    thumb: string | null;
  };
  is_driver: boolean;
  is_teamleader: boolean;
  pointing_internal?: any[] | null;
  _isSub: boolean;
};

interface AgentRowProps {
  agents: RowAgent[];
  subcontractorAgents?: RowAgent[];
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
  const [measuredOverflowHeight, setMeasuredOverflowHeight] = useState(0);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const expandedRef = useRef(false);

  const allAgents = useMemo(
    () => [...agents, ...subcontractorAgents],
    [agents, subcontractorAgents],
  );

  const usableWidth =
    cardWidth > 0 ? cardWidth - 32 : Dimensions.get("window").width - 64;
  const maxPerRow = Math.max(1, Math.floor(usableWidth / ITEM_SLOT));
  const firstRow = allAgents.slice(0, maxPerRow);
  const restRows = allAgents.slice(maxPerRow);
  const hasOverflow = restRows.length > 0;

  const toggleExpand = () => {
    const next = !expandedRef.current;
    expandedRef.current = next;
    setExpanded(next);

    if (next) {
      Animated.spring(heightAnim, {
        toValue: measuredOverflowHeight,
        useNativeDriver: false,
        tension: 55,
        friction: 10,
      }).start();
    } else {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View>
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
              if (h > 0 && h !== measuredOverflowHeight) {
                setMeasuredOverflowHeight(h);
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
                  key={`measure-${agent._isSub ? "s" : "a"}-${agent.id}-${i}`}
                  agent={agent}
                  displayPointing={false}
                  delay={0}
                  isSubcontractor={agent._isSub}
                  T={T}
                />
              ))}
            </View>
          </View>

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
