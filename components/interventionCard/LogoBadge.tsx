import React, { memo, useEffect, useRef, useState } from "react";
import { Animated, Image, Text } from "react-native";
import { isValidUrl } from "./helpers";
import { Tokens } from "./tokens";

interface LogoBadgeProps {
  logos: any;
  name: string;
  T: Tokens;
}

export const LogoBadge = memo(({ logos, name, T }: LogoBadgeProps) => {
  const anim = useRef(new Animated.Value(0)).current;
  const [imgError, setImgError] = useState(false);

  const hasLogo = isValidUrl(logos?.thumb) && !imgError;
  const initial = name?.[0]?.toUpperCase() ?? "V";

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 70,
      friction: 7,
      delay: 50,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: T.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: anim,
        transform: [{ scale: anim }],
      }}
    >
      {hasLogo ? (
        <Image
          source={{ uri: logos.thumb }}
          style={{ width: 44, height: 44 }}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <Text
          style={{
            fontSize: 22,
            fontWeight: "900",
            color: T.primaryText,
          }}
        >
          {initial}
        </Text>
      )}
    </Animated.View>
  );
});
