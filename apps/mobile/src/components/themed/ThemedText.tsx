import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '@hooks/useTheme';

export type ThemedTextVariant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'tiny';
export type ThemedTextColor  = 'primary' | 'secondary' | 'muted' | 'brand' | 'success' | 'danger';

interface ThemedTextProps {
  variant?:  ThemedTextVariant;
  color?:    ThemedTextColor;
  mono?:     boolean;           // Use DM Mono — for time display
  style?:    StyleProp<TextStyle>;
  children?: React.ReactNode;
  numberOfLines?: number;
}

const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body',
  color   = 'primary',
  mono    = false,
  style,
  children,
  numberOfLines,
}) => {
  const { theme } = useTheme();

  const scale = theme.typography.scale[variant];

  const colorMap: Record<ThemedTextColor, string> = {
    primary:   theme.colors.text.primary,
    secondary: theme.colors.text.secondary,
    muted:     theme.colors.text.muted,
    brand:     theme.colors.brand.primary,
    success:   theme.colors.feedback.success.text,
    danger:    theme.colors.feedback.danger.text,
  };

  const textStyle: TextStyle = {
    fontSize:   scale.fontSize,
    fontWeight: scale.fontWeight,
    lineHeight: scale.lineHeight,
    fontFamily: mono
      ? theme.typography.fonts.mono
      : theme.typography.fonts.sans,
    color: colorMap[color],
  };

  return (
    <Text style={[textStyle, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

export default ThemedText;
