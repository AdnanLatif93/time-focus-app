import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStyles from '@hooks/useStyles';
import { ThemedText } from '@components/themed';
import { EmptyState, LoadingBlock } from '@components/layout';
import { TimelineItem } from '../components/TimelineItem';
import { getAllBlocks } from '../api/allBlocksApi';
import { TimeBlock, BlockStatus } from '@/types';
import {
  isBlockActive,
  timeToMinutes,
  nowInMinutes,
  getTodayLabel,
} from '@timer/blockTimeUtils';

interface AllBlocksScreenProps {
  navigation?: {
    navigate: (screen: 'BlockDetail', params: { blockId: string }) => void;
  };
}

const resolveStatus = (block: TimeBlock): BlockStatus => {
  const startMins = block.startMinutes ?? timeToMinutes(block.startTime);
  const endMins   = block.endMinutes   ?? timeToMinutes(block.endTime);
  if (isBlockActive(startMins, endMins)) return 'active';
  if (nowInMinutes() >= endMins)         return 'done';
  return 'upcoming';
};

const AllBlocksScreen: React.FC<AllBlocksScreenProps> = ({ navigation }) => {
  const [blocks,    setBlocks]    = useState<TimeBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const listRef      = useRef<FlatList>(null);
  const activeIndex  = useRef<number>(-1);

  const styles = useStyles((t) => ({
    safe: {
      flex:            1,
      backgroundColor: t.colors.background.primary,
    },
    header: {
      paddingHorizontal: t.spacing.lg,
      paddingTop:        t.spacing.lg,
      paddingBottom:     t.spacing.md,
      gap:               2,
    },
    list: {
      paddingHorizontal: t.spacing.lg,
      paddingBottom:     t.spacing.xxxl,
    },
    loadingWrapper: {
      padding: t.spacing.lg,
      gap:     t.spacing.md,
    },
  }));

  const fetchBlocks = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await getAllBlocks();
      // Sort by startMinutes / startTime
      const sorted = [...data].sort((a, b) => {
        const aMin = a.startMinutes ?? timeToMinutes(a.startTime);
        const bMin = b.startMinutes ?? timeToMinutes(b.startTime);
        return aMin - bMin;
      });
      setBlocks(sorted);

      // Find active block index for auto-scroll
      const idx = sorted.findIndex((b) => resolveStatus(b) === 'active');
      activeIndex.current = idx;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blocks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchBlocks(); }, [fetchBlocks]);

  // Auto-scroll to active block after list renders
  const handleLayout = useCallback(() => {
    if (activeIndex.current >= 0 && listRef.current) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({
          index:    activeIndex.current,
          animated: true,
          viewPosition: 0.3,
        });
      }, 300);
    }
  }, []);

  const handleBlockPress = (id: string) => {
    navigation?.navigate('BlockDetail', { blockId: id });
  };

  const todayLabel = getTodayLabel();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText variant="h1">Today's Schedule</ThemedText>
        <ThemedText variant="caption" color="muted">
          {todayLabel} · {blocks.length} blocks
        </ThemedText>
      </View>

      {/* Loading */}
      {isLoading && (
        <View style={styles.loadingWrapper}>
          {[0, 1, 2].map((i) => <LoadingBlock key={i} />)}
        </View>
      )}

      {/* Error */}
      {error && !isLoading && (
        <EmptyState
          title="Could not load"
          message={error}
          action={{ label: 'Retry', onPress: fetchBlocks }}
        />
      )}

      {/* Empty */}
      {!isLoading && !error && blocks.length === 0 && (
        <EmptyState
          title="No Blocks Found"
          message="Upload your schedule Excel file to see your day."
        />
      )}

      {/* Timeline list */}
      {!isLoading && blocks.length > 0 && (
        <FlatList
          ref={listRef}
          data={blocks}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          onLayout={handleLayout}
          onScrollToIndexFailed={(info) => {
            // Fallback if index not yet rendered
            setTimeout(() => {
              listRef.current?.scrollToIndex({
                index:    info.index,
                animated: true,
              });
            }, 500);
          }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchBlocks}
              tintColor="#F5C347"
            />
          }
          renderItem={({ item, index }) => (
            <TimelineItem
              block={item}
              isLast={index === blocks.length - 1}
              onPress={handleBlockPress}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default AllBlocksScreen;
