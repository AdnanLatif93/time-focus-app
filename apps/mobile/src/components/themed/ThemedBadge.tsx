import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import useStyles from '@hooks/useStyles';
import { useTheme } from '@hooks/useTheme';
import ThemedText from './ThemedText';
import { Theme } from '@theme/index';

export type ThemedBadgeVariant =
  | 'jism'
  | 'rooh'
  | 'dimag'
  | 'active'
  | 'done'
  | 'upcoming'
  | 'default';

export type ThemedBadgeSize = 'sm' | 'md';

interface ThemedBadgeProps {
  variant?: ThemedBadgeVariant;
  label:    string;
  size?:    ThemedBadgeSize;
  style?:   StyleProp<ViewStyle>;
}

// Resolve bg + text color per variant
const resolveColors = (
  variant: ThemedBadgeVariant,
  theme: Theme
): { bg: string; text: string; border: string } => {
  switch (variant) {
    case 'jism':
      return {
        bg:     theme.colors.category.jism.bg,
        text:   theme.colors.category.jism.text,
        border: theme.colors.category.jism.border,
      };
    case 'rooh':
      return {
        bg:     theme.colors.category.rooh.bg,
        text:   theme.colors.category.rooh.text,
        border: theme.colors.category.rooh.border,
      };
    case 'dimag':
      return {
        bg:     theme.colors.category.dimag.bg,
        text:   theme.colors.category.dimag.text,
        border: theme.colors.category.dimag.border,
      };
    case 'active':
      return {
        bg:     theme.colors.status.active.bg,
        text:   theme.colors.status.active.text,
        border: theme.colors.brand.primary,
      };
    case 'done':
      return {
        bg:     theme.colors.status.done.bg,
        text:   theme.colors.status.done.text,
        border: theme.colors.surface.border,
      };
    case 'upcoming':
      return {
        bg:     theme.colors.status.upcoming.bg,
        text:   theme.colors.status.upcoming.text,
        border: theme.colors.surface.border,
      };
    default:
      return {
        bg:     theme.colors.surface.elevated,
        text:   theme.colors.text.secondary,
        border: theme.colors.surface.border,
      };
  }
};

const ThemedBadge: React.FC<ThemedBadgeProps> = ({
  variant = 'default',
  label,
  size    = 'md',
  style,
}) => {
  const { theme } = useTheme();
  const { bg, text, border } = resolveColors(variant, theme);

  const styles = useStyles((t) => ({
    badge: {
      alignSelf:         'flex-start',
      flexDirection:     'row',
      alignItems:        'center',
      backgroundColor:   bg,
      borderRadius:      t.radius.pill,
      borderWidth:       1,
      borderColor:       border,
      paddingHorizontal: size === 'sm' ? t.spacing.sm  : t.spacing.md,
      paddingVertical:   size === 'sm' ? 2              : t.spacing.xs,
    },
  }));

  return (
    <View style={[styles.badge, style]}>
      <ThemedText
        variant={size === 'sm' ? 'tiny' : 'caption'}
        style={{ color: text }}
      >
        {label}
      </ThemedText>
    </View>
  );
};

export default ThemedBadge;
