'use client';

import { useAction } from 'next-safe-action/hooks';
import { createContext, useContext, useEffect, useState } from 'react';
import { getSettings } from '@/lib/settings/get/get';
import { updateSettings } from '@/lib/settings/update/actions/update';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyTheme(newTheme: Theme) {
  const root = document.documentElement;
  if (newTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const { execute: updateSettingsAction } = useAction(updateSettings);

  useEffect(() => {
    // Get theme from database
    async function loadTheme() {
      try {
        const settings = await getSettings();
        const initialTheme = settings.theme || 'light';
        setThemeState(initialTheme);
        applyTheme(initialTheme);
      } catch (error) {
        console.error('Error loading theme:', error);
        // Fallback to light theme
        setThemeState('light');
        applyTheme('light');
      }
    }
    loadTheme();
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    // Save to database
    updateSettingsAction({ theme: newTheme });
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
