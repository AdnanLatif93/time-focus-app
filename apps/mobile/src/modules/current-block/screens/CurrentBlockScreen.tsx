import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStyles from '@hooks/useStyles';
import { useTheme } from '@hooks/useTheme';
import useCurrentBlock from '@hooks/useCurrentBlock';
import {
  ThemedText,
  ThemedCard,
} from '@components/themed';
import {
  TimeDisplay,
  BlockCard,
  NextBlockPill,
  ProgressBar,
} from '@components/common';
import { LoadingBlock, EmptyState } from '@components/layout';
import {
  getCurrentTimeString,
  getTodayLabel,
} from '@timer/blockTimeUtils';

// ─── Time Remaining Card ──────────────────────────────────────────────────────
const TimeRemainingCard: React.FC<{ minutes: number }> = ({ minutes }) => {
  const styles = useStyles((t) => ({
    card: {
      alignItems:      'center',
      justifyContent:  'center',
      backgroundColor: t.colors.category.dimag.bg, // amber tint
      borderColor:     t.colors.brand.primary,
      paddingVertical: t.spacing.xl,
      gap:             t.spacing.xs,
    },
    number: {
      fontSize:   64,
      fontWeight: '700',
      color:      '#F5C347',
      lineHeight: 72,
    },
  }));

  return (
    <ThemedCard style={styles.card} noPadding>
      <ThemedText style={styles.number}>{minutes}</ThemedText>
      <ThemedText variant="caption" color="muted">minutes remaining</ThemedText>
    </ThemedCard>
  );
};

// ─── Up Next Card ─────────────────────────────────────────────────────────────
const UpNextCard: React.FC<{
  blockName: string;
  startTime: string;
}> = ({ blockName, startTime }) => {
  const styles = useStyles((t) => ({
    card: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      backgroundColor: t.colors.surface.card,
      borderColor:    t.colors.surface.border,
    },
    left: {
      gap: 2,
    },
  }));

  return (
    <ThemedCard style={styles.card}>
      <View style={styles.left}>
        <ThemedText variant="tiny" color="muted">UP NEXT</ThemedText>
        <ThemedText variant="h3">{blockName}</ThemedText>
      </View>
      <TimeDisplay time={startTime} size="sm" color="secondary" />
    </ThemedCard>
  );
};

// ─── Live Clock ───────────────────────────────────────────────────────────────
const LiveClock: React.FC = () => {
  const [time, setTime] = useState(getCurrentTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TimeDisplay
      time={time.replace(':', ' : ')} // "07 : 23" — spaced like design
      size="display"
      color="primary"
    />
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const CurrentBlockScreen: React.FC = () => {
  const { currentBlock, nextBlock, isLoading, error, refetch } = useCurrentBlock();

  const styles = useStyles((t) => ({
    safe: {
      flex:            1,
      backgroundColor: t.colors.background.primary,
    },
    scroll: {
      flexGrow:          1,
      paddingHorizontal: t.spacing.lg,
      paddingBottom:     t.spacing.xxxl,
      gap:               t.spacing.lg,
    },
    greeting: {
      paddingTop: t.spacing.lg,
      gap:        t.spacing.xs,
    },
    section: {
      gap: t.spacing.md,
    },
  }));

  const todayLabel = getTodayLabel();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#F5C347" />
        }
      >
        {/* ── Greeting + Clock ── */}
        <View style={styles.greeting}>
          <ThemedText variant="body" color="secondary">
            Assalam o Alaikum, Ahmad
          </ThemedText>

          <LiveClock />

          <ThemedText variant="body" color="muted">
            {todayLabel}
          </ThemedText>
        </View>

        {/* ── Loading state ── */}
        {isLoading && !currentBlock && (
          <View style={styles.section}>
            <LoadingBlock />
            <LoadingBlock />
          </View>
        )}

        {/* ── Error state ── */}
        {error && !isLoading && (
          <EmptyState
            title="Could not load"
            message={error}
            action={{ label: 'Retry', onPress: refetch }}
          />
        )}

        {/* ── No active block ── */}
        {!isLoading && !error && !currentBlock && (
          <EmptyState
            title="No Active Block"
            message="There is no scheduled block running right now."
          />
        )}

        {/* ── Active block ── */}
        {currentBlock && (
          <View style={styles.section}>
            {/* Block card */}
            <BlockCard
              blockName={currentBlock.blockName}
              startTime={currentBlock.startTime}
              endTime={currentBlock.endTime}
              tasks={currentBlock.todayTasks}
              status="active"
              progressPercent={currentBlock.progressPercent}
            />

            {/* Time remaining card */}
            <TimeRemainingCard minutes={currentBlock.timeRemainingMinutes} />

            {/* Standalone progress bar */}
            <ProgressBar
              percent={currentBlock.progressPercent}
              showLabel
              height={4}
            />
          </View>
        )}

        {/* ── Up Next ── */}
        {nextBlock && (
          <UpNextCard
            blockName={nextBlock.blockName}
            startTime={nextBlock.startTime}
          />
        )}

      </ScrollView>

      {/* ── Next block pill — fixed bottom ── */}
      {nextBlock && (
        <NextBlockPill
          blockName={nextBlock.blockName}
          startTime={nextBlock.startTime}
          startsInMinutes={nextBlock.startsInMinutes}
        />
      )}
    </SafeAreaView>
  );
};

export default CurrentBlockScreen;
