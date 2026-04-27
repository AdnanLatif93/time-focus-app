import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import useStyles from '@hooks/useStyles';
import { useTheme } from '@hooks/useTheme';
import { ThemedCard, ThemedText, ThemedBadge } from '@components/themed';
import TimeDisplay from './TimeDisplay';
import TaskItem from './TaskItem';
import ProgressBar from './ProgressBar';
import { Task, BlockStatus } from '@/types';

interface BlockCardProps {
  blockName:        string;
  startTime:        string;
  endTime:          string;
  tasks:            Task[];
  status:           BlockStatus;
  progressPercent?: number;
  onPress?:         () => void;
}

// Pulsing dot for active block
const PulsingDot: React.FC = () => {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.5, duration: 700, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1,   duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [scale]);

  return (
    <Animated.View
      style={{
        width:           8,
        height:          8,
        borderRadius:    4,
        backgroundColor: theme.colors.brand.primary,
        transform:       [{ scale }],
      }}
    />
  );
};

const BlockCard: React.FC<BlockCardProps> = ({
  blockName,
  startTime,
  endTime,
  tasks,
  status,
  progressPercent,
  onPress,
}) => {
  const { theme } = useTheme();

  const styles = useStyles((t) => ({
    card: {
      // Active: amber left border + subtle amber tint
      borderLeftWidth: status === 'active' ? 3 : 0,
      borderLeftColor: status === 'active' ? t.colors.brand.primary : 'transparent',
      backgroundColor: status === 'active'
        ? t.colors.category.dimag.bg   // amber tint (#3D2E00)
        : t.colors.surface.card,
    },
    header: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   t.spacing.sm,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           t.spacing.sm,
      flex:          1,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           t.spacing.xs,
      marginBottom:  t.spacing.sm,
    },
    timeSeparator: {
      color: t.colors.text.muted,
    },
    tasksWrapper: {
      gap:       t.spacing.xs,
      marginTop: t.spacing.xs,
    },
    progressWrapper: {
      marginTop: t.spacing.sm,
    },
  }));

  const statusBadgeVariant = status === 'active'
    ? 'active'
    : status === 'done'
      ? 'done'
      : 'upcoming';

  return (
    <ThemedCard onPress={onPress} style={styles.card}>

      {/* Header: block name + status badge */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {status === 'active' && <PulsingDot />}
          <ThemedText
            variant="h3"
            color={status === 'done' ? 'muted' : 'primary'}
            numberOfLines={1}
          >
            {blockName}
          </ThemedText>
        </View>
        <ThemedBadge
          variant={statusBadgeVariant}
          label={status.charAt(0).toUpperCase() + status.slice(1)}
          size="sm"
        />
      </View>

      {/* Time range */}
      <View style={styles.timeRow}>
        <TimeDisplay time={startTime} size="sm" color="secondary" />
        <ThemedText variant="caption" color="muted">→</ThemedText>
        <TimeDisplay time={endTime}   size="sm" color="secondary" />
      </View>

      {/* Progress bar — only for active */}
      {status === 'active' && progressPercent !== undefined && (
        <View style={styles.progressWrapper}>
          <ProgressBar percent={progressPercent} showLabel />
        </View>
      )}

      {/* Task list */}
      {tasks.length > 0 && (
        <View style={styles.tasksWrapper}>
          {tasks.map((task, idx) => (
            <TaskItem
              key={idx}
              task={task}
              isCompleted={status === 'done'}
              showCategory
            />
          ))}
        </View>
      )}

    </ThemedCard>
  );
};

export default BlockCard;
