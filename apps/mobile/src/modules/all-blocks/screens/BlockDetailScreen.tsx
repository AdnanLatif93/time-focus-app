import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStyles from '@hooks/useStyles';
import {
  ThemedText,
  ThemedCard,
  ThemedDivider,
} from '@components/themed';
import { TimeDisplay, DayBadge } from '@components/common';
import { ScreenHeader, LoadingBlock, EmptyState } from '@components/layout';
import { getBlockById } from '../api/allBlocksApi';
import { TimeBlock, Task, SubWindow } from '@/types';

interface BlockDetailScreenProps {
  navigation?: {
    goBack: () => void;
  };
  route?: {
    params?: { blockId?: string };
  };
}

// ─── Numbered Task Row ────────────────────────────────────────────────────────
const DetailTaskRow: React.FC<{ task: Task; index: number }> = ({ task, index }) => {
  const categoryLabel: Record<string, string> = {
    jism:  'جسم',
    rooh:  'روح',
    dimag: 'دماغ',
    ALL:   '',
  };

  const dayLabel = task.dayType === 'ALL' ? 'All days' : task.dayType;

  const styles = useStyles((t) => ({
    row: {
      flexDirection:  'row',
      alignItems:     'flex-start',
      gap:            t.spacing.md,
      paddingVertical: t.spacing.sm,
    },
    number: {
      width:     24,
      textAlign: 'right',
    },
    content: {
      flex: 1,
      gap:  t.spacing.xs,
    },
    meta: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           t.spacing.sm,
    },
  }));

  return (
    <View style={styles.row}>
      {/* Number */}
      <ThemedText variant="caption" color="muted" style={styles.number}>
        {String(index + 1).padStart(2, '0')}
      </ThemedText>

      <View style={styles.content}>
        {/* Activity text */}
        <ThemedText variant="body">{task.activity}</ThemedText>

        {/* Meta: category badge + day */}
        <View style={styles.meta}>
          {task.category !== 'ALL' && (
            <ThemedText variant="tiny" color="muted">
              {categoryLabel[task.category]}
            </ThemedText>
          )}
          <DayBadge day={task.dayType} />
          {task.dayType === 'ALL' && (
            <ThemedText variant="tiny" color="muted">All days</ThemedText>
          )}
        </View>
      </View>
    </View>
  );
};

// ─── Sub-window section ───────────────────────────────────────────────────────
const SubWindowSection: React.FC<{ window: SubWindow; tasks: Task[] }> = ({
  window,
  tasks,
}) => {
  const styles = useStyles((t) => ({
    wrapper: {
      gap: t.spacing.sm,
    },
    header: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           t.spacing.sm,
    },
    timeRow: {
      flexDirection: 'row',
      gap:           t.spacing.xs,
      alignItems:    'center',
    },
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <ThemedText variant="h3">{window.label}</ThemedText>
        <View style={styles.timeRow}>
          <TimeDisplay time={window.startTime} size="sm" color="muted" />
          <ThemedText variant="caption" color="muted">–</ThemedText>
          <TimeDisplay time={window.endTime}   size="sm" color="muted" />
        </View>
      </View>
      {tasks.map((task, i) => (
        <DetailTaskRow key={i} task={task} index={i} />
      ))}
    </View>
  );
};

// ─── List item types ──────────────────────────────────────────────────────────
type ListItem =
  | { type: 'header';   block: TimeBlock }
  | { type: 'divider';  label: string }
  | { type: 'task';     task: Task; index: number }
  | { type: 'subwindow'; window: SubWindow; tasks: Task[] };

// ─── Main Screen ──────────────────────────────────────────────────────────────
const BlockDetailScreen: React.FC<BlockDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const blockId = route?.params?.blockId ?? '';

  const [block,     setBlock]     = useState<TimeBlock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const styles = useStyles((t) => ({
    safe: {
      flex:            1,
      backgroundColor: t.colors.background.primary,
    },
    list: {
      paddingHorizontal: t.spacing.lg,
      paddingBottom:     t.spacing.xxxl,
    },
    // Header card
    headerCard: {
      gap:           t.spacing.md,
      marginBottom:  t.spacing.sm,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           t.spacing.xs,
    },
    reflectionBar: {
      borderLeftWidth: 3,
      borderLeftColor: '#2A2A2A',
      paddingLeft:     t.spacing.md,
    },
  }));

  useEffect(() => {
    if (!blockId) return;
    setIsLoading(true);
    getBlockById(blockId)
      .then(setBlock)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [blockId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader
          title="Block Detail"
          backButton
          onBack={() => navigation?.goBack()}
        />
        <View style={{ padding: 16, gap: 12 }}>
          <LoadingBlock />
          <LoadingBlock />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !block) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader
          title="Block Detail"
          backButton
          onBack={() => navigation?.goBack()}
        />
        <EmptyState
          title="Not Found"
          message={error ?? 'Block could not be loaded'}
          action={{ label: 'Go Back', onPress: () => navigation?.goBack() }}
        />
      </SafeAreaView>
    );
  }

  // ── Build flat list items ──────────────────────────────────────────────────
  const items: ListItem[] = [];

  // Header card
  items.push({ type: 'header', block });

  // If block has sub-windows, group tasks by window
  if (block.windows && block.windows.length > 0) {
    block.windows.forEach((win) => {
      items.push({ type: 'subwindow', window: win, tasks: block.tasks ?? [] });
      items.push({ type: 'divider', label: '' });
    });
  } else {
    // Flat task list
    if (block.tasks?.length) {
      items.push({ type: 'divider', label: 'Tasks' });
      block.tasks.forEach((task, i) => {
        items.push({ type: 'task', task, index: i });
      });
    }
  }

  const renderItem: ListRenderItem<ListItem> = ({ item }) => {
    switch (item.type) {

      case 'header':
        return (
          <ThemedCard style={styles.headerCard}>
            {/* Block name */}
            <ThemedText variant="display">{item.block.blockName}</ThemedText>

            {/* Time range — amber */}
            <View style={styles.timeRow}>
              <TimeDisplay time={item.block.startTime} size="lg" color="brand" />
              <ThemedText variant="h2" color="brand"> — </ThemedText>
              <TimeDisplay time={item.block.endTime}   size="lg" color="brand" />
            </View>

            {/* Reflection question */}
            {item.block.reflectionQuestion ? (
              <View style={styles.reflectionBar}>
                <ThemedText
                  variant="body"
                  color="muted"
                  style={{ fontStyle: 'italic' }}
                >
                  {item.block.reflectionQuestion}
                </ThemedText>
              </View>
            ) : null}
          </ThemedCard>
        );

      case 'divider':
        return (
          <ThemedDivider
            label={item.label || undefined}
            spacing="md"
          />
        );

      case 'task':
        return <DetailTaskRow task={item.task} index={item.index} />;

      case 'subwindow':
        return (
          <SubWindowSection
            window={item.window}
            tasks={item.tasks}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={block.blockName}
        backButton
        onBack={() => navigation?.goBack()}
      />

      <FlatList
        data={items}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default BlockDetailScreen;
