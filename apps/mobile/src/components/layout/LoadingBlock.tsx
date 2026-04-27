import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import useStyles from '@hooks/useStyles';

// Single shimmer line
const ShimmerLine: React.FC<{ width: string | number; height?: number }> = ({
  width,
  height = 12,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  const styles = useStyles((theme) => ({
    line: {
      width,
      height,
      borderRadius:    theme.radius.sm,
      backgroundColor: theme.colors.surface.elevated,
    },
  }));

  return <Animated.View style={[styles.line, { opacity }]} />;
};

// Full skeleton card
const LoadingBlock: React.FC = () => {
  const styles = useStyles((theme) => ({
    card: {
      backgroundColor: theme.colors.surface.card,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.surface.border,
      padding:         theme.spacing.lg,
      gap:             theme.spacing.md,
    },
    header: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
    },
    timeRow: {
      flexDirection: 'row',
      gap:           theme.spacing.sm,
    },
    taskRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           theme.spacing.sm,
    },
    dot: {
      width:           6,
      height:          6,
      borderRadius:    theme.radius.pill,
      backgroundColor: theme.colors.surface.elevated,
    },
  }));

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <ShimmerLine width="55%" height={16} />
        <ShimmerLine width={52} height={20} />
      </View>

      {/* Time row */}
      <View style={styles.timeRow}>
        <ShimmerLine width={40} height={12} />
        <ShimmerLine width={12} height={12} />
        <ShimmerLine width={40} height={12} />
      </View>

      {/* Task rows */}
      {[0.85, 0.65, 0.75].map((w, i) => (
        <View key={i} style={styles.taskRow}>
          <View style={styles.dot} />
          <ShimmerLine width={`${w * 100}%`} height={12} />
        </View>
      ))}
    </View>
  );
};

export default LoadingBlock;
