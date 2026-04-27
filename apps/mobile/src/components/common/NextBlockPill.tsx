import React from 'react';
import { View, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import useStyles from '@hooks/useStyles';
import { ThemedText } from '@components/themed';
import TimeDisplay from './TimeDisplay';

interface NextBlockPillProps {
  blockName:        string;
  startTime:        string;
  startsInMinutes:  number;
  onPress?:         () => void;
  style?:           StyleProp<ViewStyle>;
}

const NextBlockPill: React.FC<NextBlockPillProps> = ({
  blockName,
  startTime,
  startsInMinutes,
  onPress,
  style,
}) => {
  const styles = useStyles((theme) => ({
    pill: {
      flexDirection:     'row',
      alignItems:        'center',
      backgroundColor:   theme.colors.surface.elevated,
      borderRadius:      theme.radius.pill,
      borderWidth:       1,
      borderColor:       theme.colors.surface.border,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical:   theme.spacing.sm,
      gap:               theme.spacing.sm,
    },
    label: {
      color: '#888888',
    },
    arrow: {
      marginHorizontal: theme.spacing.xs,
    },
    nameWrapper: {
      flex: 1,
    },
    minutesWrapper: {
      backgroundColor: theme.colors.surface.card,
      borderRadius:    theme.radius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical:   2,
    },
  }));

  const minuteLabel = startsInMinutes <= 1
    ? 'now'
    : `${startsInMinutes}m`;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
      style={[styles.pill, style]}
    >
      {/* "Up Next" label */}
      <ThemedText variant="tiny" color="muted">Up Next</ThemedText>

      {/* Arrow */}
      <ThemedText variant="caption" color="muted" style={styles.arrow}>→</ThemedText>

      {/* Block name */}
      <ThemedText variant="caption" color="secondary" style={styles.nameWrapper} numberOfLines={1}>
        {blockName}
      </ThemedText>

      {/* Start time */}
      <TimeDisplay time={startTime} size="sm" color="muted" />

      {/* Starts in X min */}
      <View style={styles.minutesWrapper}>
        <ThemedText variant="tiny" color="brand">{minuteLabel}</ThemedText>
      </View>
    </TouchableOpacity>
  );
};

export default NextBlockPill;
