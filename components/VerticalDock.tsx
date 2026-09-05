"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import ThemeToggle from "@/components/ThemeToggle";

interface VerticalDockProps {
  activeSection: string;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  onLogoClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

const BASE_SIZE = 40; // Base diameter of dock items (px)
const MAX_SCALE = 1.48; // Maximum scale factor (up to ~59px)
const INFLUENCE_RADIUS = 120; // Proximity radius for magnification wave (px)

export default function VerticalDock({
  activeSection,
  onNavClick,
  onLogoClick,
}: VerticalDockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const [mouseY, setMouseY] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // References for all items: 0 = GP, 1..5 = Nav Items, 6 = Theme
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const restingCenters = useRef<number[]>([]);

  const navItems: NavItem[] = [
    {
      id: "about",
      label: "About",
      href: "#about",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors duration-200 ${
            active
              ? "stroke-black dark:stroke-[#00D2FF]"
              : "stroke-[#9C9C9C] group-hover:stroke-black dark:group-hover:stroke-white"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: "skills",
      label: "Skills",
      href: "#skills",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors duration-200 ${
            active
              ? "stroke-black dark:stroke-[#00D2FF]"
              : "stroke-[#9C9C9C] group-hover:stroke-black dark:group-hover:stroke-white"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      id: "work",
      label: "Experience",
      href: "#work",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors duration-200 ${
            active
              ? "stroke-black dark:stroke-[#00D2FF]"
              : "stroke-[#9C9C9C] group-hover:stroke-black dark:group-hover:stroke-white"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      id: "projects",
      label: "Projects",
      href: "#projects",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors duration-200 ${
            active
              ? "stroke-black dark:stroke-[#00D2FF]"
              : "stroke-[#9C9C9C] group-hover:stroke-black dark:group-hover:stroke-white"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: "contact",
      label: "Contact",
      href: "#contact",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors duration-200 ${
            active
              ? "stroke-black dark:stroke-[#00D2FF]"
              : "stroke-[#9C9C9C] group-hover:stroke-black dark:group-hover:stroke-white"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  // Measure baseline resting centers of items when unmagnified
  const measureRestingCenters = useCallback(() => {
    const centers: number[] = [];
    itemRefs.current.forEach((el) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        centers.push(rect.top + rect.height / 2);
      }
    });
    if (centers.length > 0) {
      restingCenters.current = centers;
    }
  }, []);

  useEffect(() => {
    measureRestingCenters();
    window.addEventListener("resize", measureRestingCenters);
    return () => window.removeEventListener("resize", measureRestingCenters);
  }, [measureRestingCenters]);

  // macOS-style Cosine Bell-Curve magnification
  const getScale = (itemIndex: number) => {
    if (mouseY === null || !restingCenters.current[itemIndex]) return 1;

    const centerY = restingCenters.current[itemIndex];
    const distance = Math.abs(mouseY - centerY);

    if (distance > INFLUENCE_RADIUS) return 1;

    // Smooth cosine falloff curve
    const progress = Math.cos((distance / INFLUENCE_RADIUS) * (Math.PI / 2));
    return 1 + (MAX_SCALE - 1) * Math.pow(progress, 1.35);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    measureRestingCenters();
    setIsHovering(true);
    setMouseY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseY(e.clientY);
  };

  const handleMouseLeave = () => {
    setMouseY(null);
    setIsHovering(false);
  };

  // Calculate current max scale to dynamically expand dock capsule width
  const scales = [
    getScale(0), // GP
    getScale(1), // About
    getScale(2), // Skills
    getScale(3), // Experience
    getScale(4), // Projects
    getScale(5), // Contact
    getScale(6), // Theme
  ];
  const maxCurrentScale = Math.max(1, ...scales);
  const dockWidth = Math.round(Math.max(54, BASE_SIZE * maxCurrentScale + 18));

  return (
    <aside
      aria-label="Vertical Navigation Dock"
      className="fixed left-3 sm:left-5 lg:left-6 top-1/2 -translate-y-1/2 z-50 select-none pointer-events-auto"
    >
      {/* ─── DOCK SHELF CAPSULE (Dynamically wraps and expands) ─── */}
      <div
        ref={dockRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          width: `${dockWidth}px`,
        }}
        className={`relative flex flex-col items-center gap-1.5 sm:gap-2 p-2 rounded-[28px] sm:rounded-full bg-white/80 dark:bg-[#0a0a0c]/85 backdrop-blur-2xl border border-black/10 dark:border-white/[0.12] shadow-2xl shadow-black/25 dark:shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] ${
          isHovering
            ? "transition-[width] duration-100 ease-out"
            : "transition-all duration-300 ease-out"
        }`}
      >
        {/* ─── 0. TOP GP LOGO / HOME ANCHOR ─── */}
        {(() => {
          const scale = scales[0];
          const slotSize = Math.round(BASE_SIZE * scale);

          return (
            <div
              ref={(el) => {
                itemRefs.current[0] = el;
              }}
              style={{
                width: `${slotSize}px`,
                height: `${slotSize}px`,
              }}
              className={`flex items-center justify-center ${
                isHovering
                  ? "transition-[width,height] duration-100 ease-out"
                  : "transition-[width,height] duration-300 ease-out"
              }`}
            >
              <a
                href="#"
                onClick={onLogoClick}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                }}
                className="group relative flex items-center justify-center w-10 h-10 rounded-full text-foreground hover:text-black dark:hover:text-[#00D2FF] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] active:scale-90 transition-all duration-150 cursor-pointer"
                title="Scroll to Top"
                aria-label="Scroll to top"
              >
                <span className="font-serif font-black text-sm tracking-tighter">
                  GP
                </span>

                {/* macOS Slide-out Tooltip */}
                <div className="absolute left-full ml-4 px-2.5 py-1 rounded-md bg-black/95 dark:bg-[#161618]/95 text-white text-[11px] font-mono whitespace-nowrap shadow-2xl border border-white/10 opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 z-50">
                  <span>[top]</span>
                </div>
              </a>
            </div>
          );
        })()}

        {/* Divider 1 */}
        <div className="w-5 h-[1px] bg-black/10 dark:bg-white/[0.12] my-0.5 shrink-0" />

        {/* ─── 1..5 NAVIGATION ITEMS (WITH MOTION WRAPPING & HIGH CONTRAST) ─── */}
        <div className="flex flex-col items-center gap-1.5 sm:gap-2">
          {navItems.map((item, i) => {
            const itemIndex = i + 1; // 1 to 5
            const isActive = activeSection === item.id;
            const scale = scales[itemIndex];
            const slotSize = Math.round(BASE_SIZE * scale);

            return (
              <div
                key={item.id}
                ref={(el) => {
                  itemRefs.current[itemIndex] = el;
                }}
                style={{
                  width: `${slotSize}px`,
                  height: `${slotSize}px`,
                }}
                className={`flex items-center justify-center ${
                  isHovering
                    ? "transition-[width,height] duration-100 ease-out"
                    : "transition-[width,height] duration-300 ease-out"
                }`}
              >
                <a
                  href={item.href}
                  onClick={(e) => onNavClick(e, item.href)}
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "center center",
                  }}
                  className={`group relative flex items-center justify-center w-10 h-10 rounded-full active:scale-90 transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-black/10 dark:bg-white/[0.14] border border-black/30 dark:border-[#00D2FF]/70 shadow-sm dark:shadow-[0_0_18px_rgba(0,210,255,0.4)] text-black dark:text-[#00D2FF]"
                      : "text-[#9C9C9C] hover:text-black dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
                  }`}
                  aria-label={item.label}
                >
                  {/* Clean Non-Clipping Active Dot Indicator on the inside left edge */}
                  {isActive && (
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-black dark:bg-[#00D2FF] shadow-[0_0_8px_rgba(0,210,255,0.95)] pointer-events-none" />
                  )}

                  {/* Icon with crisp, radiant contrast */}
                  {item.icon(isActive)}

                  {/* macOS Slide-out Tooltip */}
                  <div className="absolute left-full ml-4 px-2.5 py-1 rounded-md bg-black/95 dark:bg-[#161618]/95 text-white text-[11px] font-mono font-medium whitespace-nowrap shadow-2xl border border-white/10 opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 flex items-center gap-2 z-50">
                    <span>[{item.label.toLowerCase()}]</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]" />
                    )}
                  </div>
                </a>
              </div>
            );
          })}
        </div>

        {/* Divider 2 */}
        <div className="w-5 h-[1px] bg-black/10 dark:bg-white/[0.12] my-0.5 shrink-0" />

        {/* ─── 6. BOTTOM THEME TOGGLE ─── */}
        {(() => {
          const scale = scales[6];
          const slotSize = Math.round(BASE_SIZE * scale);

          return (
            <div
              ref={(el) => {
                itemRefs.current[6] = el;
              }}
              style={{
                width: `${slotSize}px`,
                height: `${slotSize}px`,
              }}
              className={`flex items-center justify-center ${
                isHovering
                  ? "transition-[width,height] duration-100 ease-out"
                  : "transition-[width,height] duration-300 ease-out"
              }`}
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                }}
                className="group relative flex items-center justify-center w-10 h-10 active:scale-90 transition-all duration-150"
              >
                <ThemeToggle className="!w-10 !h-10 !rounded-full !border-0 !bg-transparent hover:!bg-black/[0.06] dark:hover:!bg-white/[0.08]" />

                {/* macOS Slide-out Tooltip */}
                <div className="absolute left-full ml-4 px-2.5 py-1 rounded-md bg-black/95 dark:bg-[#161618]/95 text-white text-[11px] font-mono whitespace-nowrap shadow-2xl border border-white/10 opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 z-50">
                  <span>[theme]</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </aside>
  );
}
