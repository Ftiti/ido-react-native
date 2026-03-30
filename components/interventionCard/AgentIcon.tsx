import {
    FontAwesome6,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { memo } from "react";

export const AgentIcon = memo(
  ({
    is_teamleader,
    is_driver,
    color,
  }: {
    is_teamleader: boolean;
    is_driver: boolean;
    color: string;
  }) => {
    if (is_teamleader)
      return (
        <MaterialCommunityIcons
          name="account-hard-hat"
          size={24}
          color={color}
        />
      );
    if (is_driver)
      return <FontAwesome6 name="truck-field" size={20} color={color} />;
    return <Ionicons name="person-sharp" size={24} color={color} />;
  },
);
