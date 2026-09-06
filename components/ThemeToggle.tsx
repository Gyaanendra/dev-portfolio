"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { SunIcon, MoonIcon } from "@animateicons/react/lucide";

interface ThemeToggleProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
  onThemeChange?: (newTheme: "light" | "dark") => void;
}

const emptySubscribe = () => () => {};

export default function ThemeToggle({
  className = "",
  duration = 700,
  onThemeChange,
  ...props
}: ThemeToggleProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = useSyncExternalStore(
    (callback) => {
      const observer = new MutationObserver(callback);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => observer.disconnect();
    },
    () => document.documentElement.classList.contains("dark"),
    () => false
  );

  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTransitioningRef = useRef(false);

  // Ensure View Transition root pseudo-element rules are active
  useEffect(() => {
    let styleElement = document.getElementById(
      "toggle-theme-vt-override"
    ) as HTMLStyleElement | null;
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "toggle-theme-vt-override";
      styleElement.textContent = `
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, []);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current || isTransitioningRef.current) return;

    const nextTheme = !isDark;

    const applyTheme = () => {
      if (nextTheme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      onThemeChange?.(nextTheme ? "dark" : "light");
    };

    // Fallback for browsers without View Transition API or prefers-reduced-motion
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      applyTheme();
      return;
    }

    isTransitioningRef.current = true;

    try {
      // 1. Wait for the DOM update snapshot to complete within the View Transition
      await document.startViewTransition(() => {
        flushSync(() => {
          applyTheme();
        });
      }).ready;

      // 2. Measure coordinates and dimensions AFTER the new DOM snapshot is ready
      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      );

      // 3. Exact Lightswind circle-spread hardware-accelerated clipPath animation
      const animation = document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );

      await animation.finished;
    } catch {
      // Fallback in case transition is aborted or fails
    } finally {
      isTransitioningRef.current = false;
    }
  }, [isDark, duration, onThemeChange]);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 border border-border-custom bg-card rounded-sm ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      className={`group relative flex items-center justify-center w-9 h-9 border border-border-custom hover:border-accent bg-card rounded-sm text-foreground overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer ${className}`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      {...props}
    >
      {isDark ? (
        <SunIcon size={18} className="text-accent pointer-events-none" />
      ) : (
        <MoonIcon size={18} className="text-current pointer-events-none" />
      )}

      {/* Subtle hover accent outline only when bordered */}
      {!className.includes("!border-0") && (
        <span className="absolute inset-0 rounded-sm border border-transparent group-hover:border-accent/30 pointer-events-none" />
      )}
    </button>
  );
}
