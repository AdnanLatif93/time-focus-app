import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import useStyles from '@hooks/useStyles';
import ThemedText from './ThemedText';

type DividerSpacing = 'sm' | 'md' | 'lg';

interface ThemedDividerProps {
  spacing?: DividerSpacing;
  label?:   string; // Optional center label
  style?:   StyleProp<ViewStyle>;
}

const ThemedDivider: React.FC<ThemedDividerProps> = ({
  spacing = 'md',
  label,
  style,
}) => {
  const styles = useStyles((theme) => {
    const spacingMap = {
      sm: theme.spacing.sm,
      md: theme.spacing.md,
      lg: theme.spacing.lg,
    };

    return {
      wrapper: {
        flexDirection:  'row',
        alignItems:     'center',
        marginVertical: spacingMap[spacing],
      },
      line: {
        flex:            1,
        height:          1,
        backgroundColor: theme.colors.surface.border,
      },
      labelWrapper: {
        marginHorizontal: theme.spacing.sm,
      },
    };
  });

  if (label) {
    return (
      <View style={[styles.wrapper, style]}>
        <View style={styles.line} />
        <View style={styles.labelWrapper}>
          <ThemedText variant="caption" color="muted">
            {label}
          </ThemedText>
        </View>
        <View style={styles.line} />
      </View>
    );
  }

  return <View style={[styles.wrapper, style]}><View style={styles.line} /></View>;
};

export default ThemedDivider;
