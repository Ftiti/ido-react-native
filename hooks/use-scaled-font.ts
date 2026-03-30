import { useFontSizeStore } from "@/app-states/font-resizer/FontSizeStore";

export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
};

export function useScaledFont() {
  const fontScale = useFontSizeStore((s) => s.fontScale);
  const scale = (size: number) => Math.round(size * fontScale);
  return { scale, fontScale };
}
