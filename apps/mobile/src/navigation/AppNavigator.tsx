import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@hooks/useTheme';
import useAppSelector from '@hooks/useAppSelector';

// Screens
import { CurrentBlockScreen } from '@modules/current-block/screens';
import { AllBlocksScreen, BlockDetailScreen } from '@modules/all-blocks/screens';
import { UploadScreen } from '@modules/schedule/screens';

// ─── Navigator param lists ────────────────────────────────────────────────────
export type RootStackParamList = {
  Main:        undefined;
  Upload:      undefined;
  BlockDetail: { blockId: string };
};

export type TabParamList = {
  Now:      undefined;
  Schedule: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab       = createBottomTabNavigator<TabParamList>();

// ─── Tab Icons ────────────────────────────────────────────────────────────────
const NowIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <Text style={{ fontSize: size, color, lineHeight: size + 4 }}>◉</Text>
);

const ScheduleIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <Text style={{ fontSize: size, color, lineHeight: size + 4 }}>☰</Text>
);

// ─── Bottom Tab Navigator ─────────────────────────────────────────────────────
const TabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Now"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor:  theme.colors.surface.card,
          borderTopWidth:   0,
          elevation:        0,
          shadowOpacity:    0,
          height:           60,
          paddingBottom:    8,
          paddingTop:       6,
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
        component={CurrentBlockScreen}
        options={{
          tabBarLabel: 'Now',
          tabBarIcon: ({ color, size }) => <NowIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={AllBlocksScreen}
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ color, size }) => <ScheduleIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

// ─── Root Stack Navigator ─────────────────────────────────────────────────────
const RootNavigator: React.FC = () => {
  const isLoaded = useAppSelector((s) => s.schedule.isLoaded);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoaded ? (
        <RootStack.Screen name="Upload" component={UploadScreen} />
      ) : (
        <>
          <RootStack.Screen name="Main"        component={TabNavigator} />
          <RootStack.Screen name="BlockDetail" component={BlockDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <RootStack.Screen name="Upload"      component={UploadScreen}
            options={{ presentation: 'modal' }}
          />
        </>
      )}
    </RootStack.Navigator>
  );
};

// ─── AppNavigator ─────────────────────────────────────────────────────────────
const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

export default AppNavigator;
