"use client";

import { useMemo } from "react";

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

const COLORS = {
  github: ["var(--gh-0)", "var(--gh-1)", "var(--gh-2)", "var(--gh-3)", "var(--gh-4)"],
  leetcode: ["var(--lc-0)", "var(--lc-1)", "var(--lc-2)", "var(--lc-3)", "var(--lc-4)"],
};

export default function HeatmapGrid({ weeks, type, onHover, onLeave, year }: HeatmapGridProps) {
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

  const colors = COLORS[type];

  if (!weeks.length) return null;

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-sm p-3 md:p-4">
      {/* Header row: year label + legend */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border)]">
        <span className="text-[11px] font-mono font-semibold text-foreground">
          {year ? `${year} Activity` : "Past Year Activity"}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-muted font-mono">Less</span>
          <div className="flex items-center gap-[3px]">
            {colors.map((c, i) => (
              <div key={i} className="w-[10px] h-[10px] rounded-[2.5px]" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span className="text-[9px] text-muted font-mono">More</span>
        </div>
      </div>

      {/* Scrollable heatmap */}
      <div className="overflow-x-auto pb-1 scrollbar-thin">
        <div className="min-w-[790px]">
          {/* Month headers */}
          <div className="flex ml-[30px] mb-[6px]">
            {monthHeaders.map((label, i) => (
              <div
                key={i}
                className="text-[9.5px] text-muted font-mono leading-none"
                style={{ width: "12px", marginRight: "4px" }}
              >
                {label}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Day labels */}
            <div className="grid grid-rows-7 gap-[4px] mr-[8px] pt-[1px]" style={{ height: "108px" }}>
              {DAY_LABELS.map((label, i) => (
                <span
                  key={i}
                  className={`text-[9px] text-muted font-mono uppercase tracking-[0.5px] leading-[12px] h-[12px] ${i % 2 === 0 ? "" : "opacity-0"}`}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Cells grid */}
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
                    const plural = type === "github" ? "contributions" : "submissions";
                    const singular = type === "github" ? "contribution" : "submission";
                    const label = day.count === 1 ? singular : plural;
                    const hoverText = day.date
                      ? `${day.count} ${label} on ${dateLabel}`
                      : "";

                    const handleHover = (e: React.MouseEvent) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      onHover({ top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom }, hoverText);
                    };

                    return (
                      <div
                        key={`${colIdx}-${rowIdx}`}
                        className="relative group"
                      >
                        <div
                          className="w-[12px] h-[12px] rounded-[3.5px] cursor-pointer transition-transform duration-75 hover:scale-[1.25] hover:z-10 hover:outline hover:outline-[1.5px] hover:outline-offset-[1px] hover:outline-foreground"
                          style={{ backgroundColor: cellColor }}
                          onMouseEnter={handleHover}
                          onMouseMove={handleHover}
                          onMouseLeave={onLeave}
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
