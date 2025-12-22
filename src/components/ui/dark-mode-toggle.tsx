"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect } from "react";
import { useDarkMode } from "usehooks-ts";

export function DarkModeToggle() {
  const { isDarkMode, toggle } = useDarkMode({
    initializeWithValue: false,
    defaultValue: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDarkMode]);

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={toggle}
      className="ml-4 rounded-full p-2 transition hover:bg-accent border border-border bg-card"
      type="button"
    >
      {isDarkMode ? (
        <IconSun className="w-5 h-5 text-primary" />
      ) : (
        <IconMoon className="w-5 h-5 text-primary" />
      )}
    </button>
  );
}
