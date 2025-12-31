import { useCallback, useEffect, useMemo, useState } from 'react';

const THEME_STORAGE_KEY = 'theme-preference';

/**
 * Determine initial theme:
 * - If a user preference exists in localStorage, honor it.
 * - Otherwise, fall back to system preference via prefers-color-scheme.
 */
function getInitialTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // Ignore localStorage failures (privacy mode, blocked storage, etc.)
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  return 'light';
}

// PUBLIC_INTERFACE
export function useTheme() {
  /** Manages light/dark theme with system default + localStorage persistence, applying root classes. */
  const [theme, setTheme] = useState(getInitialTheme);

  const isDark = theme === 'dark';

  // Apply theme to document root in a way that's easy for CSS to target.
  useEffect(() => {
    const root = document.documentElement;

    // Provide both a data-attribute (already used by existing CSS) and classes (requested).
    root.setAttribute('data-theme', theme);
    root.classList.toggle('theme-dark', theme === 'dark');
    root.classList.toggle('theme-light', theme === 'light');
  }, [theme]);

  // Persist explicit user choice.
  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore persistence issues; theme will still work for the session.
    }
  }, [theme]);

  // PUBLIC_INTERFACE
  const setThemeExplicit = useCallback((nextTheme) => {
    /** Sets theme explicitly to "light" or "dark". */
    setTheme(nextTheme);
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = useCallback(() => {
    /** Toggles theme between "light" and "dark". */
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return useMemo(
    () => ({
      theme,
      isDark,
      setTheme: setThemeExplicit,
      toggleTheme
    }),
    [theme, isDark, setThemeExplicit, toggleTheme]
  );
}
