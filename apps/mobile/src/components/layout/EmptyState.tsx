import React from 'react';
import { View } from 'react-native';
import useStyles from '@hooks/useStyles';
import { ThemedText, ThemedButton } from '@components/themed';

interface EmptyStateProps {
  title:   string;
  message: string;
  action?: {
    label:   string;
    onPress: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  action,
}) => {
  const styles = useStyles((theme) => ({
    wrapper: {
      flex:           1,
      alignItems:     'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
      gap:            theme.spacing.md,
    },
    textBlock: {
      alignItems: 'center',
      gap:        theme.spacing.xs,
    },
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.textBlock}>
        <ThemedText variant="h2" color="secondary">
          {title}
        </ThemedText>
        <ThemedText variant="body" color="muted" style={{ textAlign: 'center' }}>
          {message}
        </ThemedText>
      </View>

      {action && (
        <ThemedButton
          variant="primary"
          label={action.label}
          onPress={action.onPress}
        />
      )}
    </View>
  );
};

export default EmptyState;
