import { Text as RNText, TextProps, useColorScheme } from "react-native";

import { Colors, Fonts } from "@/constants/theme";

export type ThemedTextProps = TextProps & {
  /**
   * Text color variant
   * - 'default': Primary text color
   * - 'icon': Secondary/muted text color
   * - 'tint': Accent/brand color
   */
  color?: "default" | "icon" | "tint";

  /**
   * Font family variant
   * - 'sans': System default sans-serif
   * - 'serif': Serif font
   * - 'rounded': Rounded font (iOS)
   * - 'mono': Monospace font
   */
  font?: "sans" | "serif" | "rounded" | "mono";

  /**
   * Override the color scheme (light/dark)
   * If not provided, uses system color scheme
   */
  colorScheme?: "light" | "dark";
};

export default function ThemedText({
  style,
  color = "default",
  font = "sans",
  colorScheme,
  ...rest
}: ThemedTextProps) {
  const systemColorScheme = (useColorScheme() ?? "light") as "light" | "dark";
  const activeColorScheme = colorScheme ?? systemColorScheme;

  // Get the appropriate color
  const textColor =
    color === "default"
      ? Colors[activeColorScheme].text
      : color === "icon"
        ? Colors[activeColorScheme].icon
        : Colors[activeColorScheme].tint;

  // Get the appropriate font family
  const fontFamily = Fonts[font];

  return (
    <RNText
      style={[
        {
          color: textColor,
          fontFamily,
        },
        style,
      ]}
      {...rest}
    />
  );
}

// Convenience components for common text variants
export function ThemedTextTitle(props: ThemedTextProps) {
  return (
    <ThemedText
      {...props}
      style={[{ fontSize: 24, fontWeight: "bold" }, props.style]}
    />
  );
}

export function ThemedTextSubtitle(props: ThemedTextProps) {
  return (
    <ThemedText
      {...props}
      style={[{ fontSize: 18, fontWeight: "600" }, props.style]}
    />
  );
}

export function ThemedTextBody(props: ThemedTextProps) {
  return <ThemedText {...props} style={[{ fontSize: 16 }, props.style]} />;
}

export function ThemedTextCaption(props: ThemedTextProps) {
  return (
    <ThemedText
      {...props}
      color="icon"
      style={[{ fontSize: 12 }, props.style]}
    />
  );
}

export function ThemedTextMono(props: ThemedTextProps) {
  return (
    <ThemedText
      {...props}
      font="mono"
      style={[{ fontSize: 14 }, props.style]}
    />
  );
}
