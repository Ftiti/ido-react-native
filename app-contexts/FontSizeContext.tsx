import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type FontSizeLevel = -4 | -2 | 0 | 2 | 4;

interface FontSizeContextType {
  fontSizeAdjustment: FontSizeLevel;
  setFontSizeAdjustment: (size: FontSizeLevel) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSizeAdjustment, setFontSizeAdjustmentState] = useState<FontSizeLevel>(0);

  useEffect(() => {
    loadFontSize();
  }, []);

  const loadFontSize = async () => {
    try {
      const value = await AsyncStorage.getItem('fontSizeAdjustment');
      if (value !== null) {
        setFontSizeAdjustmentState(parseInt(value) as FontSizeLevel);
      }
    } catch (error) {
      // Silently fail on Expo Go
    }
  };

  const setFontSizeAdjustment = (size: FontSizeLevel) => {
    setFontSizeAdjustmentState(size);
    AsyncStorage.setItem('fontSizeAdjustment', size.toString()).catch(() => {});
  };

  return (
    <FontSizeContext.Provider value={{ fontSizeAdjustment, setFontSizeAdjustment }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within FontSizeProvider');
  }
  return context;
};

export const adjustFontSize = (baseSize: number, adjustment: FontSizeLevel): number => {
  return baseSize + adjustment;
};
