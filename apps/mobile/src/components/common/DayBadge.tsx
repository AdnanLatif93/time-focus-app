import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { ThemedBadge } from '@components/themed';
import { DayType } from '@/types';

interface DayBadgeProps {
  day:    DayType;
  style?: StyleProp<ViewStyle>;
}

const DayBadge: React.FC<DayBadgeProps> = ({ day, style }) => {
  // ALL days = no badge needed
  if (day === 'ALL') return null;

  return (
    <ThemedBadge
      variant="default"
      label={day}
      size="sm"
      style={style}
    />
  );
};

export default DayBadge;
