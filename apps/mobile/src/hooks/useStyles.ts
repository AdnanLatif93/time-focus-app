import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from './useTheme';
import { Theme } from '../theme';

/**
 * Creates a memoized StyleSheet tied to the current theme.
 * Only recreates when the theme changes (dark ↔ light switch).
 *
 * @example
 * const styles = useStyles((theme) => ({
 *   container: { backgroundColor: theme.colors.surface.card },
 *   title:     { color: theme.colors.text.primary, fontSize: theme.typography.scale.h2.fontSize },
 * }));
 */
const useStyles = <T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: Theme) => T
): T => {
  const { theme } = useTheme();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
};

export default useStyles;
