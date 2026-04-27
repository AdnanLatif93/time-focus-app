import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NowStackParamList } from './types';
import { CurrentBlockScreen } from '@modules/current-block/screens';
import { AllBlocksScreen } from '@modules/all-blocks/screens';

const Stack = createNativeStackNavigator<NowStackParamList>();

// NowStack: CurrentBlock → AllBlocks (pushed from "Next Block" pill)
const NowStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CurrentBlock" component={CurrentBlockScreen} />
    <Stack.Screen
      name="AllBlocks"
      component={AllBlocksScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </Stack.Navigator>
);

export default NowStack;
