import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@hooks/useTheme';
import { TabParamList } from './types';
import NowStack      from './NowStack';
import ScheduleStack from './ScheduleStack';

const Tab = createBottomTabNavigator<TabParamList>();

// ─── Tab Icons ────────────────────────────────────────────────────────────────
const NowIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <Text style={{ fontSize: size - 2, color, lineHeight: size + 2 }}>◉</Text>
);

const ScheduleIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <Text style={{ fontSize: size - 2, color, lineHeight: size + 2 }}>☰</Text>
);

// ─── Main Tab Navigator ───────────────────────────────────────────────────────
const MainTabs: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Now"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface.card,
          borderTopWidth:  0,
          elevation:       0,
          shadowOpacity:   0,
          height:          60,
          paddingBottom:   8,
          paddingTop:      6,
        },
        tabBarActiveTintColor:   theme.colors.brand.primary,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarLabelStyle: {
          fontSize:   11,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Now"
        component={NowStack}
        options={{
          tabBarLabel: 'Now',
          tabBarIcon: ({ color, size }) => <NowIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleStack}
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ color, size }) => <ScheduleIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
