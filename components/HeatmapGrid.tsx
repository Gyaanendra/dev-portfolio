"use client";

import { useMemo, useRef, useEffect } from "react";

export interface CalendarDay {
  date: string;
  count: number;
  level: number; // 0-4
}

interface CellRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
}

interface HeatmapGridProps {
  weeks: CalendarDay[][];
  type: "github" | "leetcode";
  onHover: (rect: CellRect, text: string) => void;
  onLeave: () => void;
  year: number | null;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const COLORS = {
  github: ["var(--gh-0)", "var(--gh-1)", "var(--gh-2)", "var(--gh-3)", "var(--gh-4)"],
  leetcode: ["var(--lc-0)", "var(--lc-1)", "var(--lc-2)", "var(--lc-3)", "var(--lc-4)"],
};

export default function HeatmapGrid({ weeks, type, onHover, onLeave, year }: HeatmapGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const monthHeaders = useMemo(() => {
    if (!weeks.length) return [];
    const headers: string[] = new Array(weeks.length).fill("");
    let lastMonth = "";
    weeks.forEach((week, colIdx) => {
      const day = week.find((d) => d.date);
      if (!day) return;
      const d = new Date(day.date);
      // When filtering by a specific year, skip months from adjacent years
      if (year && d.getFullYear() < year) return;
      const m = d.toLocaleString("default", { month: "short" });
      if (m !== lastMonth) {
        headers[colIdx] = m;
        lastMonth = m;
      }
    });
    return headers;
  }, [weeks, year]);

  // On smaller screens / mobile phones, auto-scroll to the right end so the most recent activity is immediately visible
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollToRight = () => {
      if (el.scrollWidth > el.clientWidth) {
        el.scrollLeft = el.scrollWidth - el.clientWidth;
      }
    };

    // Run immediately and in animation frame for precise post-render measurement
    scrollToRight();
    const frameId = requestAnimationFrame(scrollToRight);

    window.addEventListener("resize", scrollToRight);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", scrollToRight);
    };
  }, [weeks, year]);

  const colors = COLORS[type];

  if (!weeks.length) return null;

  return (
    <div className="w-full">
      {/* Scrollable heatmap sitting directly on the canvas without card container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-2 scrollbar-thin"
      >
        <div className="min-w-[790px]">
          {/* Month headers */}
          <div className="flex ml-[32px] mb-[8px]">
            {monthHeaders.map((label, i) => (
              <div
                key={i}
                className="text-[10px] text-muted font-mono leading-none select-none"
                style={{ width: "12px", marginRight: "4px" }}
              >
                {label}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Day labels */}
            <div
              className="grid grid-rows-7 gap-[4px] mr-[10px] pt-[1px] select-none"
              style={{ height: "108px" }}
            >
              {DAY_LABELS.map((label, i) => (
                <span
                  key={i}
                  className={`text-[9px] text-muted font-mono uppercase tracking-[0.5px] leading-[12px] h-[12px] ${
                    i % 2 === 0 ? "" : "opacity-0"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Cells grid directly on page canvas */}
            <div className="flex-1">
              <div
                className="grid"
                style={{
                  gridAutoFlow: "column",
                  gridTemplateRows: "repeat(7, 12px)",
                  gridAutoColumns: "12px",
                  gap: "4px",
                  height: "108px",
                }}
              >
                {weeks.map((week, colIdx) =>
                  week.map((day, rowIdx) => {
                    const cellColor = colors[day.level] || colors[0];
                    const dateLabel = day.date
                      ? new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "";
                    const plural =
                      type === "github" ? "contributions" : "submissions";
                    const singular =
                      type === "github" ? "contribution" : "submission";
                    const label = day.count === 1 ? singular : plural;
                    const hoverText = day.date
                      ? `${day.count} ${label} on ${dateLabel}`
                      : "";

                    const handleHover = (e: React.MouseEvent) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      onHover(
                        {
                          top: r.top,
                          left: r.left,
                          width: r.width,
                          height: r.height,
                          bottom: r.bottom,
                        },
                        hoverText
                      );
                    };

                    return (
                      <div
                        key={`${colIdx}-${rowIdx}`}
                        className="relative group"
                      >
                        <div
                          className="w-[12px] h-[12px] rounded-[2.5px] cursor-pointer transition-all duration-150 hover:scale-[1.3] hover:z-10 hover:ring-2 hover:ring-accent hover:ring-offset-1 hover:ring-offset-background"
                          style={{ backgroundColor: cellColor }}
                          onMouseEnter={handleHover}
                          onMouseMove={handleHover}
                          onMouseLeave={onLeave}
                          onClick={handleHover}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
