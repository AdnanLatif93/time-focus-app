import React from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import useStyles from '@hooks/useStyles';

interface ThemedCardProps {
  onPress?:   () => void;
  style?:     StyleProp<ViewStyle>;
  children?:  React.ReactNode;
  noPadding?: boolean;
}

const ThemedCard: React.FC<ThemedCardProps> = ({
  onPress,
  style,
  children,
  noPadding = false,
}) => {
  const styles = useStyles((theme) => ({
    card: {
      backgroundColor: theme.colors.surface.card,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.surface.border,
      padding:         noPadding ? 0 : theme.spacing.lg,
      ...theme.shadows.card,
    },
  }));

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.75}
        style={[styles.card, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

export default ThemedCard;
