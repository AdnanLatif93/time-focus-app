import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme, Theme } from './index';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ThemeMode = 'dark' | 'light' | 'system';

export interface ThemeContextValue {
  theme:   Theme;
  mode:    ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

// ─── Storage key ─────────────────────────────────────────────────────────────
const STORAGE_KEY = '@focusday/theme_mode';

// ─── Context ──────────────────────────────────────────────────────────────────
export const ThemeContext = createContext<ThemeContextValue>({
  theme:   darkTheme,
  mode:    'dark',
  setMode: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme(); // 'dark' | 'light' | null
  const [mode, setModeState] = useState<ThemeMode>('dark'); // default dark

  // Load persisted preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'dark' || saved === 'light' || saved === 'system') {
          setModeState(saved);
        }
      })
      .catch(() => {
        // Silently fall back to default
      });
  }, []);

  // Persist whenever mode changes
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode).catch(() => {});
  }, []);

  // Resolve which theme object to use
  const theme = useMemo<Theme>(() => {
    if (mode === 'system') {
      return systemScheme === 'light' ? lightTheme : darkTheme;
    }
    return mode === 'light' ? lightTheme : darkTheme;
  }, [mode, systemScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, mode, setMode }),
    [theme, mode, setMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
};
