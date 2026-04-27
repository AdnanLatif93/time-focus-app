import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import { ThemeProvider } from '@theme/ThemeProvider';
import AppNavigator from '@navigation/AppNavigator';

// ─── Bootstrap — starts background services ───────────────────────────────────
function AppBootstrap(): React.JSX.Element {
  useEffect(() => {
    (async () => {
      try {
        const { createNotificationChannel } = await import('./src/widget/WidgetNotification');
        const { BlockTimer }                = await import('./src/timer/BlockTimer');
        await createNotificationChannel();
        BlockTimer.start();
      } catch (err) {
        console.warn('[App] Background services init failed:', err);
      }
    })();
  }, []);

  return <AppNavigator />;
}

// ─── Root — provider order ────────────────────────────────────────────────────
// SafeAreaProvider → ThemeProvider → Redux Provider → NavigationContainer (inside AppNavigator)
export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider>
          <AppBootstrap />
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
