import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAppSelector from '@hooks/useAppSelector';
import { RootStackParamList } from './types';
import UploadStack from './UploadStack';
import MainTabs    from './MainTabs';

const Root = createNativeStackNavigator<RootStackParamList>();

// ─── Root Navigator ───────────────────────────────────────────────────────────
// Switches between UploadStack and MainTabs based on Redux isLoaded
const RootNavigator: React.FC = () => {
  const isLoaded = useAppSelector((s) => s.schedule.isLoaded);

  return (
    <Root.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!isLoaded ? (
        // No schedule → Upload flow (no tab bar)
        <Root.Screen name="UploadStack" component={UploadStack} />
      ) : (
        // Schedule loaded → Main tabs
        <Root.Screen name="MainTabs" component={MainTabs} />
      )}
    </Root.Navigator>
  );
};

// ─── AppNavigator — exported root ─────────────────────────────────────────────
const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

export default AppNavigator;
