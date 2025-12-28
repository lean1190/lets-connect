'use client';

import { IconMoon, IconSun } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './theme-provider';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">Theme</p>
        <p className="text-xs text-muted-foreground mt-1">App style</p>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={theme === 'light' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTheme('light')}
          className="flex items-center gap-2"
        >
          <IconSun className="w-4 h-4" />
          <span>Light</span>
        </Button>
        <Button
          type="button"
          variant={theme === 'dark' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTheme('dark')}
          className="flex items-center gap-2"
        >
          <IconMoon className="w-4 h-4" />
          <span>Dark</span>
        </Button>
      </div>
    </div>
  );
}
