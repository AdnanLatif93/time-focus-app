import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import useStyles from '@hooks/useStyles';
import ThemedText from './ThemedText';

export type ThemedButtonVariant = 'primary' | 'ghost' | 'danger';
export type ThemedButtonSize    = 'sm' | 'md' | 'lg';

interface ThemedButtonProps {
  variant?:  ThemedButtonVariant;
  label:     string;
  onPress:   () => void;
  disabled?: boolean;
  loading?:  boolean;
  size?:     ThemedButtonSize;
  icon?:     React.ReactNode; // Leading icon
  style?:    StyleProp<ViewStyle>;
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
  variant  = 'primary',
  label,
  onPress,
  disabled = false,
  loading  = false,
  size     = 'md',
  icon,
  style,
}) => {
  const styles = useStyles((theme) => {
    const sizeMap = {
      sm: { paddingVertical: theme.spacing.sm,  paddingHorizontal: theme.spacing.md },
      md: { paddingVertical: theme.spacing.md,  paddingHorizontal: theme.spacing.lg },
      lg: { paddingVertical: theme.spacing.lg,  paddingHorizontal: theme.spacing.xl },
    };

    const variantMap = {
      primary: {
        backgroundColor: theme.colors.brand.primary,
        borderWidth:     0,
        borderColor:     'transparent',
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth:     1,
        borderColor:     theme.colors.brand.primary,
      },
      danger: {
        backgroundColor: theme.colors.feedback.danger.bg,
        borderWidth:     1,
        borderColor:     theme.colors.feedback.danger.border,
      },
    };

    return {
      button: {
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'center',
        borderRadius:   theme.radius.md,
        ...sizeMap[size],
        ...variantMap[variant],
        opacity: disabled ? 0.5 : 1,
      },
      iconWrapper: {
        marginRight: theme.spacing.sm,
      },
    };
  });

  const textColorMap: Record<ThemedButtonVariant, 'primary' | 'brand' | 'danger'> = {
    primary: 'primary', // dark text on amber
    ghost:   'brand',   // amber text
    danger:  'danger',  // red text
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[styles.button, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <ThemedText variant="body" color={textColorMap[variant]}>
            {label}
          </ThemedText>
        </>
      )}
    </TouchableOpacity>
  );
};

export default ThemedButton;
