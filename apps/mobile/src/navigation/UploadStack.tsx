import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UploadStackParamList } from './types';
import { UploadScreen } from '@modules/schedule/screens';

const Stack = createNativeStackNavigator<UploadStackParamList>();

const UploadStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Upload" component={UploadScreen} />
  </Stack.Navigator>
);

export default UploadStack;
