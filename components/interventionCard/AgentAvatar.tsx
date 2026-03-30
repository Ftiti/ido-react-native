import React, { memo, useEffect, useRef, useState } from "react";
import { Animated, Image, View } from "react-native";
import { AgentIcon } from "./AgentIcon";
import { AVATAR_MARGIN, AVATAR_SIZE } from "./constants";
import { getPointingStatus, isValidUrl } from "./helpers";
import { StatusDot } from "./StatusDot";
import { Tokens } from "./tokens";

export const AgentAvatar = memo(
  ({
    agent,
    displayPointing,
    delay,
    isSubcontractor = false,
    T,
  }: {
    agent: any;
    displayPointing: boolean;
    delay: number;
    isSubcontractor?: boolean;
    T: Tokens;
  }) => {
    const anim = useRef(new Animated.Value(0)).current;
    const [imgError, setImgError] = useState(false);

    const thumbUrl = agent.photo_urls?.thumb ?? agent.photo_url;
    const hasValidImage = isValidUrl(thumbUrl) && !imgError;
    const status = isSubcontractor
      ? "not_started"
      : getPointingStatus(agent.pointing_internal);

    const dotColor =
      status === "finished" ? T.green : status === "started" ? T.yellow : T.red;

    useEffect(() => {
      Animated.spring(anim, {
        toValue: 1,
        delay,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();
    }, []);

    return (
      <Animated.View
        style={{
          position: "relative",
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          margin: AVATAR_MARGIN,
          opacity: anim,
          transform: [
            { scale: anim },
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        }}
      >
        <View
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
            overflow: "hidden",
            borderWidth: 2,
            borderColor: T.avatarBorder,
            backgroundColor: T.avatarBg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hasValidImage ? (
            <Image
              source={{ uri: thumbUrl }}
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <AgentIcon
              is_teamleader={!!agent.is_teamleader}
              is_driver={!!agent.is_driver}
              color={T.primaryText}
            />
          )}
        </View>

        {displayPointing && !isSubcontractor && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              borderRadius: 999,
              backgroundColor: T.cardBg,
              padding: 1.5,
              elevation: 3,
            }}
          >
            <StatusDot color={dotColor} size={12} />
          </View>
        )}
      </Animated.View>
    );
  },
);
