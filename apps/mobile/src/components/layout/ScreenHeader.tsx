import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import useStyles from '@hooks/useStyles';
import { ThemedText } from '@components/themed';

interface ScreenHeaderProps {
  title:        string;
  subtitle?:    string;
  backButton?:  boolean;
  onBack?:      () => void;
  rightAction?: React.ReactNode;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  backButton  = false,
  onBack,
  rightAction,
}) => {
  const styles = useStyles((theme) => ({
    wrapper: {
      flexDirection:   'row',
      alignItems:      'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical:   theme.spacing.md,
      gap:             theme.spacing.md,
    },
    backBtn: {
      width:           36,
      height:          36,
      borderRadius:    theme.radius.md,
      backgroundColor: theme.colors.surface.card,
      borderWidth:     1,
      borderColor:     theme.colors.surface.border,
      alignItems:      'center',
      justifyContent:  'center',
    },
    titleBlock: {
      flex: 1,
      gap:  2,
    },
    rightSlot: {
      marginLeft: 'auto',
    },
  }));

  return (
    <View style={styles.wrapper}>
      {backButton && (
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <ThemedText variant="body" color="secondary">←</ThemedText>
        </TouchableOpacity>
      )}

      <View style={styles.titleBlock}>
        <ThemedText variant="h2" numberOfLines={1}>{title}</ThemedText>
        {subtitle && (
          <ThemedText variant="caption" color="muted" numberOfLines={1}>
            {subtitle}
          </ThemedText>
        )}
      </View>

      {rightAction && <View style={styles.rightSlot}>{rightAction}</View>}
    </View>
  );
};

export default ScreenHeader;
