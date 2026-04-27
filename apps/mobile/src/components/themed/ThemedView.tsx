import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@hooks/useTheme';

export type ThemedViewVariant = 'base' | 'card' | 'elevated' | 'transparent';

interface ThemedViewProps {
  variant?: ThemedViewVariant;
  style?:   StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const ThemedView: React.FC<ThemedViewProps> = ({
  variant = 'base',
  style,
  children,
}) => {
  const { theme } = useTheme();

  const backgroundMap: Record<ThemedViewVariant, string> = {
    base:        theme.colors.surface.base,
    card:        theme.colors.surface.card,
    elevated:    theme.colors.surface.elevated,
    transparent: 'transparent',
  };

  return (
    <View style={[{ backgroundColor: backgroundMap[variant] }, style]}>
      {children}
    </View>
  );
};

export default ThemedView;
