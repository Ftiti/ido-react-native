// components/SafeAreaProviderWrapper.tsx
import React, { createContext, useContext } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeAreaContextValue {
  top: number;
  bottom: number;
}

const SafeAreaContext = createContext<SafeAreaContextValue>({
  top: 0,
  bottom: 0,
});

export const SafeAreaProviderWrapper: React.FC<{
  tabBarHeight: number;
  children: React.ReactNode;
}> = ({ tabBarHeight, children }) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaContext.Provider
      value={{
        top: insets.top,
        bottom: tabBarHeight + insets.bottom,
      }}
    >
      {children}
    </SafeAreaContext.Provider>
  );
};

export const useSafeArea = () => useContext(SafeAreaContext);
