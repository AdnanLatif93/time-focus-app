import React from 'react';
import { View } from 'react-native';
import useStyles from '@hooks/useStyles';
import { ThemedText, ThemedBadge } from '@components/themed';
import { Task } from '@/types';

interface TaskItemProps {
  task:           Task;
  isCompleted?:   boolean;
  showCategory?:  boolean;
}

const categoryLabel: Record<string, string> = {
  jism:  'جسم',
  rooh:  'روح',
  dimag: 'دماغ',
  ALL:   'All',
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isCompleted  = false,
  showCategory = true,
}) => {
  const styles = useStyles((theme) => ({
    row: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    dot: {
      width:        6,
      height:       6,
      borderRadius: theme.radius.pill,
      backgroundColor: isCompleted
        ? theme.colors.feedback.success.text
        : theme.colors.text.muted,
    },
    activityText: {
      flex: 1,
    },
  }));

  return (
    <View style={styles.row}>
      <View style={styles.dot} />

      <ThemedText
        variant="body"
        color={isCompleted ? 'muted' : 'primary'}
        style={[
          styles.activityText,
          isCompleted && { textDecorationLine: 'line-through' },
        ]}
        numberOfLines={2}
      >
        {task.activity}
      </ThemedText>

      {showCategory && task.category !== 'ALL' && (
        <ThemedBadge
          variant={task.category}
          label={categoryLabel[task.category] ?? task.category}
          size="sm"
        />
      )}
    </View>
  );
};

export default TaskItem;
