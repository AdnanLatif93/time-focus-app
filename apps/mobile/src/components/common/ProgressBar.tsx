import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import useStyles from '@hooks/useStyles';
import { ThemedText } from '@components/themed';

interface ProgressBarProps {
  percent:     number;   // 0 – 100
  showLabel?:  boolean;
  height?:     number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  showLabel = false,
  height    = 3,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue:         Math.min(Math.max(percent, 0), 100),
      duration:        400,
      useNativeDriver: false,
    }).start();
  }, [percent, animatedWidth]);

  const styles = useStyles((theme) => ({
    wrapper: {
      gap: theme.spacing.xs,
    },
    track: {
      height:          height,
      backgroundColor: theme.colors.surface.elevated,
      borderRadius:    theme.radius.pill,
      overflow:        'hidden',
    },
    label: {
      alignSelf: 'flex-end',
    },
  }));

  const fillColor = useStyles((theme) => ({
    fill: {
      height:          height,
      backgroundColor: theme.colors.brand.primary,
      borderRadius:    theme.radius.pill,
    },
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.track}>
        <Animated.View
          style={[
            fillColor.fill,
            {
              width: animatedWidth.interpolate({
                inputRange:  [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {showLabel && (
        <ThemedText variant="tiny" color="muted" style={styles.label}>
          {Math.round(percent)}%
        </ThemedText>
      )}
    </View>
  );
};

export default ProgressBar;
