"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

interface ThemeToggleProps {
  className?: string;
  onThemeChange?: (newTheme: "light" | "dark") => void;
}

export default function ThemeToggle({
  className = "",
  onThemeChange,
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const x = e.clientX;
    const y = e.clientY;

    document.documentElement.style.setProperty("--click-x", `${x}px`);
    document.documentElement.style.setProperty("--click-y", `${y}px`);

    const nextTheme = theme === "light" ? "dark" : "light";

    const applyTheme = () => {
      setTheme(nextTheme);
      localStorage.setItem("theme", nextTheme);
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      onThemeChange?.(nextTheme);
    };

    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      applyTheme();
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        applyTheme();
      });
    });
  };

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 border border-border-custom bg-card rounded-md ${className}`}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`group relative flex items-center justify-center w-9 h-9 border border-border-custom hover:border-accent bg-card transition-all duration-300 rounded-sm text-foreground overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-accent ${className}`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center pointer-events-none">
        {/* Sun Icon */}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 transition-all duration-500 transform ${
            isDark
              ? "opacity-0 scale-50 rotate-90"
              : "opacity-100 scale-100 rotate-0 text-accent"
          }`}
        >
          <circle cx="12" cy="12" r="5" fill="currentColor" className="opacity-20" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>

        {/* Moon Icon */}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 transition-all duration-500 transform ${
            isDark
              ? "opacity-100 scale-100 rotate-0 text-accent"
              : "opacity-0 scale-50 -rotate-90"
          }`}
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="currentColor"
            className="opacity-20"
          />
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>

      {/* Subtle hover ring */}
      <span className="absolute inset-0 rounded-sm border border-accent/0 group-hover:border-accent/40 transition-colors duration-300" />
    </button>
  );
}
