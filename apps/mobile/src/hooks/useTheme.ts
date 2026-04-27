// Re-export useTheme from ThemeProvider with full typing.
// Always import from here — not directly from ThemeProvider.
export { useTheme } from '../theme/ThemeProvider';
export type { ThemeContextValue, ThemeMode } from '../theme/ThemeProvider';
