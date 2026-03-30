import type { PhotoUrls } from "@/app-services/plannings/types";
import { memo, useEffect, useRef, useState } from "react";
import { Animated, Image, Text } from "react-native";
import { Tokens } from "./tokens";

interface LogoBadgeProps {
  logos?: PhotoUrls | null;
  name: string;
  T: Tokens;
}

export const LogoBadge = memo(({ logos, name, T }: LogoBadgeProps) => {
  const anim = useRef(new Animated.Value(0)).current;
  const [imgError, setImgError] = useState(false);

  const thumbUrl = logos?.thumb ?? null;
  const hasLogo = logos?.thumb?.includes("http") && !imgError;
  const initial = name?.trim()?.[0]?.toUpperCase() ?? "V";

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 70,
      friction: 7,
      delay: 50,
    }).start();
  }, [anim]);

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
          source={{ uri: thumbUrl! }}
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
