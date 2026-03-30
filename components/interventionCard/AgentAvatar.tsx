import type {
  PhotoUrls,
  PointingInternal,
} from "@/app-services/plannings/types";
import { memo, useEffect, useRef, useState } from "react";
import { Animated, Image, View } from "react-native";
import { AgentIcon } from "./AgentIcon";
import { AVATAR_MARGIN, AVATAR_SIZE } from "./constants";
import { StatusDot } from "./StatusDot";
import { Tokens } from "./tokens";

type PlanningAgentItem = {
  id: number;
  schedule_id: number;
  start_at: string | null;
  finish_at: string | null;
  agent: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    job: string | null;
    type?: string;
    active?: boolean;
    is_driver: boolean;
    is_teamleader: boolean;
    photo_urls: PhotoUrls;
  } | null;
  vehicle?: unknown;
  pointing_internal?: PointingInternal | null;
  _isSub?: boolean;
};

type SubcontractorAgentItem = {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string | null;
  phone: string | null;
  post?: string | null;
  subcontractor_id?: number;
  sms_status?: string | null;
  sms_delivered?: boolean;
  photo_urls?: PhotoUrls;
  is_driver?: boolean;
  is_teamleader?: boolean;
  pointing_internal?: PointingInternal[] | null;
  _isSub?: boolean;
};

type AvatarAgent = PlanningAgentItem | SubcontractorAgentItem;

type Props = {
  agent: AvatarAgent;
  displayPointing: boolean;
  delay: number;
  isSubcontractor?: boolean;
  T: Tokens;
};

function isPlanningAgentItem(agent: AvatarAgent): agent is PlanningAgentItem {
  return "agent" in agent;
}

export const AgentAvatar = memo(
  ({ agent, displayPointing, delay, isSubcontractor = false, T }: Props) => {
    const anim = useRef(new Animated.Value(0)).current;
    const [imgError, setImgError] = useState(false);

    const baseAgent = isPlanningAgentItem(agent) ? agent.agent : agent;

    const photoUrls: PhotoUrls = baseAgent?.photo_urls ?? {
      url: null,
      thumb: null,
    };

    const thumbUrl = photoUrls.thumb ?? null;

    const hasValidImage =
      typeof thumbUrl === "string" &&
      /^https?:\/\//.test(thumbUrl) &&
      !imgError;

    const isDriver = baseAgent?.is_driver ?? false;
    const isTeamleader = baseAgent?.is_teamleader ?? false;

    const pointing = isPlanningAgentItem(agent)
      ? agent.pointing_internal
      : agent.pointing_internal?.[0];

    const status = isSubcontractor
      ? "not_started"
      : !pointing
        ? "not_started"
        : pointing.finished_on
          ? "finished"
          : pointing.started_on
            ? "started"
            : "not_started";

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
    }, [anim, delay]);

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
              is_teamleader={isTeamleader}
              is_driver={isDriver}
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
