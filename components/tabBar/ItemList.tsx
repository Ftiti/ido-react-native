import { Colors } from "@/constants/theme";
import React from "react";
import { View, useColorScheme } from "react-native";

interface Props {
  color?: string;
}

const ItemList: React.FC<Props> = ({ color }) => {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;
  const cardColor = color || themeColors.tint;

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: themeColors.background,
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => {
        return (
          <View
            key={index}
            style={{
              width: "80%",
              height: 120,
              backgroundColor: cardColor,
              marginTop: 12,
              borderRadius: 20,
              opacity: 1 - index * 0.3,
            }}
          />
        );
      })}
    </View>
  );
};

export default ItemList;
