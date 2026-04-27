import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScheduleStackParamList } from './types';
import { AllBlocksScreen, BlockDetailScreen } from '@modules/all-blocks/screens';

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

// ScheduleStack: AllBlocks → BlockDetail (with back button)
const ScheduleStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AllBlocks"   component={AllBlocksScreen} />
    <Stack.Screen
      name="BlockDetail"
      component={BlockDetailScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </Stack.Navigator>
);

export default ScheduleStack;
