'use client';

import { useAction } from 'next-safe-action/hooks';
import { createContext, useContext, useEffect, useState } from 'react';
import { getTheme } from '@/lib/settings/get/get';
import { Theme } from '@/lib/settings/types';
import { updateSettingsAction } from '@/lib/settings/update/actions/update';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeInDom(newTheme: Theme) {
  const root = document.documentElement;
  if (newTheme === Theme.Dark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(Theme.Light);
  const { execute: executeUpdateSettings } = useAction(updateSettingsAction);

  useEffect(() => {
    async function loadTheme() {
      try {
        const settings = await getTheme();
        const initialTheme = (settings.theme as Theme) ?? Theme.Light;
        setThemeState(initialTheme);
      } catch (error) {
        console.error('Error loading theme:', error);
        setThemeState(Theme.Light);
      }
    }
    loadTheme();
  }, []);

  useEffect(() => {
    applyThemeInDom(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    executeUpdateSettings({ theme: newTheme });
  };

  // Always provide the context, even before mounting
  // The theme will be updated once mounted and database is read
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
