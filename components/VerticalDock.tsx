"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import {
  UserIcon,
  CodeXmlIcon,
  LaptopMinimalIcon,
  FolderIcon,
  MailIcon,
} from "@animateicons/react/lucide";

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
  const [restingCenters, setRestingCenters] = useState<number[]>([]);

  const navItems: NavItem[] = [
    {
      id: "about",
      label: "About",
      href: "#about",
      icon: (active) => (
        <UserIcon
          size={18}
          className={`transition-colors duration-200 ${
            active
              ? "text-black dark:text-[#00D2FF]"
              : "text-[#9C9C9C] group-hover:text-black dark:group-hover:text-white"
          }`}
        />
      ),
    },
    {
      id: "skills",
      label: "Skills",
      href: "#skills",
      icon: (active) => (
        <CodeXmlIcon
          size={18}
          className={`transition-colors duration-200 ${
            active
              ? "text-black dark:text-[#00D2FF]"
              : "text-[#9C9C9C] group-hover:text-black dark:group-hover:text-white"
          }`}
        />
      ),
    },
    {
      id: "work",
      label: "Experience",
      href: "#work",
      icon: (active) => (
        <LaptopMinimalIcon
          size={18}
          className={`transition-colors duration-200 ${
            active
              ? "text-black dark:text-[#00D2FF]"
              : "text-[#9C9C9C] group-hover:text-black dark:group-hover:text-white"
          }`}
        />
      ),
    },
    {
      id: "projects",
      label: "Projects",
      href: "#projects",
      icon: (active) => (
        <FolderIcon
          size={18}
          className={`transition-colors duration-200 ${
            active
              ? "text-black dark:text-[#00D2FF]"
              : "text-[#9C9C9C] group-hover:text-black dark:group-hover:text-white"
          }`}
        />
      ),
    },
    {
      id: "contact",
      label: "Contact",
      href: "#contact",
      icon: (active) => (
        <MailIcon
          size={18}
          className={`transition-colors duration-200 ${
            active
              ? "text-black dark:text-[#00D2FF]"
              : "text-[#9C9C9C] group-hover:text-black dark:group-hover:text-white"
          }`}
        />
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
      setRestingCenters(centers);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      measureRestingCenters();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [measureRestingCenters]);

  // macOS-style Cosine Bell-Curve magnification
  const getScale = (itemIndex: number) => {
    if (mouseY === null || !restingCenters[itemIndex]) return 1;

    const centerY = restingCenters[itemIndex];
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
      {/* ─── DOCK SHELF CAPSULE (Minimalist, uniform, precision-crafted) ─── */}
      <div
        ref={dockRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          width: `${dockWidth}px`,
        }}
        className={`relative flex flex-col items-center gap-1.5 p-1.5 rounded-full bg-white/70 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] shadow-xl shadow-black/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${
          isHovering
            ? "transition-[width] duration-100 ease-out"
            : "transition-all duration-300 ease-out"
        }`}
      >
        {/* ─── 0. TOP AVATAR / SCROLL TO TOP ─── */}
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
                className="group relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer focus:outline-none"
                title="Scroll to Top"
                aria-label="Scroll to top"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-black/15 dark:border-white/20 group-hover:border-accent transition-colors duration-200 shadow-xs">
                  <Image
                    src="/images/me1.jpg"
                    alt="Gyanendra Prakash"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-300"
                    priority
                  />
                </div>

                {/* macOS Slide-out Tooltip */}
                <div className="absolute left-full ml-3.5 px-2.5 py-1 rounded-md bg-black/95 dark:bg-[#161618]/95 text-white text-[11px] font-mono whitespace-nowrap shadow-xl border border-white/10 opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 z-50">
                  <span>[top]</span>
                </div>
              </a>
            </div>
          );
        })()}

        {/* Divider 1 */}
        <div className="w-4 h-[1px] bg-black/[0.08] dark:bg-white/[0.1] my-0.5 shrink-0" />

        {/* ─── 1..5 NAVIGATION ITEMS (CLEAN & UNIFORM) ─── */}
        <div className="flex flex-col items-center gap-1.5">
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
                  className={`group relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer focus:outline-none transition-colors duration-200 ${
                    isActive
                      ? "text-black dark:text-[#00D2FF]"
                      : "text-[#9C9C9C] hover:text-black dark:text-[#737373] dark:hover:text-white"
                  }`}
                  aria-label={item.label}
                >
                  {/* Minimalist edge indicator bar for active state */}
                  {isActive && (
                    <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-[3px] h-3.5 rounded-full bg-black dark:bg-[#00D2FF] pointer-events-none transition-all duration-200" />
                  )}

                  {/* Clean Icon with no bulky circle background */}
                  {item.icon(isActive)}

                  {/* macOS Slide-out Tooltip */}
                  <div className="absolute left-full ml-3.5 px-2.5 py-1 rounded-md bg-black/95 dark:bg-[#161618]/95 text-white text-[11px] font-mono whitespace-nowrap shadow-xl border border-white/10 opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 flex items-center gap-2 z-50">
                    <span>[{item.label.toLowerCase()}]</span>
                  </div>
                </a>
              </div>
            );
          })}
        </div>

        {/* Divider 2 */}
        <div className="w-4 h-[1px] bg-black/[0.08] dark:bg-white/[0.1] my-0.5 shrink-0" />

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
                className="group relative flex items-center justify-center w-10 h-10 transition-all duration-150"
              >
                <ThemeToggle className="!w-10 !h-10 !rounded-full !border-0 !bg-transparent text-[#9C9C9C] hover:text-black dark:text-[#737373] dark:hover:text-white" />

                {/* macOS Slide-out Tooltip */}
                <div className="absolute left-full ml-3.5 px-2.5 py-1 rounded-md bg-black/95 dark:bg-[#161618]/95 text-white text-[11px] font-mono whitespace-nowrap shadow-xl border border-white/10 opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 z-50">
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
