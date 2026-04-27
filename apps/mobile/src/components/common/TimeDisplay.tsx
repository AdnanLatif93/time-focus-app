import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { ThemedText } from '@components/themed';
import { useTheme } from '@hooks/useTheme';

type TimeDisplaySize = 'sm' | 'md' | 'lg' | 'display';

interface TimeDisplayProps {
  time:   string;                    // 'HH:MM'
  size?:  TimeDisplaySize;
  color?: 'primary' | 'secondary' | 'muted' | 'brand';
  style?: StyleProp<TextStyle>;
}

const sizeToVariant = {
  sm:      'caption',
  md:      'body',
  lg:      'h2',
  display: 'display',
} as const;

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  time,
  size  = 'md',
  color = 'primary',
  style,
}) => {
  return (
    <ThemedText
      variant={sizeToVariant[size]}
      color={color}
      mono
      style={style}
    >
      {time}
    </ThemedText>
  );
};

export default TimeDisplay;
