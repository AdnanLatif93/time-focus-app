import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import useStyles from '@hooks/useStyles';
import { useTheme } from '@hooks/useTheme';
import { ThemedText } from '@components/themed';
import { TimeDisplay } from '@components/common';
import { TimeBlock, BlockStatus } from '@/types';
import { isBlockActive, timeToMinutes, nowInMinutes } from '@timer/blockTimeUtils';

interface TimelineItemProps {
  block:    TimeBlock;
  isLast:   boolean;
  onPress:  (id: string) => void;
}

const resolveStatus = (block: TimeBlock): BlockStatus => {
  const startMins = block.startMinutes ?? timeToMinutes(block.startTime);
  const endMins   = block.endMinutes   ?? timeToMinutes(block.endTime);
  if (isBlockActive(startMins, endMins)) return 'active';
  if (nowInMinutes() >= endMins)         return 'done';
  return 'upcoming';
};

const TimelineItem: React.FC<TimelineItemProps> = ({ block, isLast, onPress }) => {
  const { theme } = useTheme();
  const status = resolveStatus(block);

  const isActive   = status === 'active';
  const isDone     = status === 'done';

  const styles = useStyles((t) => ({
    row: {
      flexDirection: 'row',
      alignItems:    'stretch',
    },
    // ── Left timeline column ──
    timelineCol: {
      width:          28,
      alignItems:     'center',
    },
    dot: {
      width:           12,
      height:          12,
      borderRadius:    t.radius.pill,
      marginTop:       t.spacing.lg + 2,
      backgroundColor: isActive
        ? t.colors.brand.primary
        : isDone
          ? t.colors.surface.elevated
          : 'transparent',
      borderWidth:  isActive ? 0 : 2,
      borderColor:  isDone
        ? t.colors.surface.elevated
        : t.colors.surface.border,
      zIndex: 1,
    },
    line: {
      flex:            1,
      width:           2,
      backgroundColor: t.colors.surface.border,
      marginTop:       2,
    },
    // ── Card column ──
    cardCol: {
      flex:           1,
      marginLeft:     t.spacing.sm,
      marginBottom:   t.spacing.md,
    },
    card: {
      borderRadius:    t.radius.lg,
      borderWidth:     1,
      padding:         t.spacing.md,
      backgroundColor: isActive
        ? t.colors.category.dimag.bg
        : t.colors.surface.card,
      borderColor: isActive
        ? t.colors.brand.primary
        : t.colors.surface.border,
      borderLeftWidth: isActive ? 3 : 1,
      borderLeftColor: isActive
        ? t.colors.brand.primary
        : t.colors.surface.border,
    },
    cardHeader: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   2,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           t.spacing.xs,
      marginTop:     2,
    },
    runningLabel: {
      marginTop: t.spacing.xs,
    },
  }));

  // First task activity as subtitle (like "JavaScript · running")
  const subtitle = block.tasks?.[0]?.activity ?? '';

  return (
    <View style={styles.row}>
      {/* Timeline dot + line */}
      <View style={styles.timelineCol}>
        <View style={styles.dot} />
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Card */}
      <View style={styles.cardCol}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => onPress(block._id)}
          activeOpacity={0.75}
        >
          <View style={styles.cardHeader}>
            <ThemedText
              variant="h3"
              color={isActive ? 'brand' : isDone ? 'muted' : 'primary'}
              numberOfLines={1}
              style={{ flex: 1 }}
            >
              {block.blockName}
            </ThemedText>
          </View>

          <View style={styles.timeRow}>
            <TimeDisplay time={block.startTime} size="sm" color="muted" />
            <ThemedText variant="caption" color="muted">–</ThemedText>
            <TimeDisplay time={block.endTime}   size="sm" color="muted" />
          </View>

          {isActive && subtitle ? (
            <ThemedText
              variant="caption"
              color="muted"
              style={styles.runningLabel}
              numberOfLines={1}
            >
              {subtitle} · running
            </ThemedText>
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TimelineItem;
