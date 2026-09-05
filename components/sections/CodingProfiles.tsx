"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import HeatmapGrid, { CalendarDay, COLORS } from "@/components/HeatmapGrid";

const GITHUB_USER = "Gyaanendra";
const LEETCODE_USER = "gyaanendra";

function buildYearOptions(): { value: number | null; label: string }[] {
  const cur = new Date().getFullYear();
  return [
    { value: null, label: "Recent" },
    { value: cur, label: String(cur) },
    { value: cur - 1, label: String(cur - 1) },
    { value: cur - 2, label: String(cur - 2) },
    { value: cur - 3, label: String(cur - 3) },
  ];
}

const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

// ─── Data processing ────────────────────────────────────────────

function processGithubData(data: any): CalendarDay[][] {
  return (data.weeks || []).map((week: any) =>
    (week.contributionDays || []).map((day: any) => ({
      date: day.date,
      count: day.contributionCount ?? 0,
      level: LEVEL_MAP[day.contributionLevel] ?? 0,
    }))
  );
}

function processLeetcodeData(
  submissionCalendar: Record<string, number>,
  year: number | null,
): CalendarDay[][] {
  const dateMap: Record<string, number> = {};
  for (const [ts, count] of Object.entries(submissionCalendar)) {
    const d = new Date(Number(ts) * 1000).toISOString().split("T")[0];
    dateMap[d] = (dateMap[d] || 0) + Number(count);
  }

  let start: Date;
  let totalDays: number;

  if (year) {
    start = new Date(Date.UTC(year, 0, 1));
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());

    const end = new Date(Date.UTC(year, 11, 31));
    end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));
    totalDays = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;
  } else {
    const today = new Date();
    const oneYearAgo = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 364),
    );
    const startDow = oneYearAgo.getUTCDay();
    start = new Date(oneYearAgo);
    start.setUTCDate(start.getUTCDate() - startDow);
    totalDays = 371;
  }

  const weeks: CalendarDay[][] = [];
  let week: CalendarDay[] = [];
  const d = new Date(start);

  for (let i = 0; i < totalDays; i++) {
    const dateStr = d.toISOString().split("T")[0];
    const count = dateMap[dateStr] || 0;

    let level = 0;
    if (count > 0) {
      if (count <= 2) level = 1;
      else if (count <= 4) level = 2;
      else if (count <= 7) level = 3;
      else level = 4;
    }

    week.push({ date: dateStr, count, level });

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    d.setUTCDate(d.getUTCDate() + 1);
  }

  return weeks;
}

function computeStats(weeks: CalendarDay[][]) {
  let total = 0;
  let activeDays = 0;
  let streak = 0;
  let maxStreak = 0;
  for (const w of weeks) {
    for (const d of w) {
      total += d.count;
      if (d.count > 0) {
        activeDays++;
        streak++;
        if (streak > maxStreak) maxStreak = streak;
      } else {
        streak = 0;
      }
    }
  }
  return { total, activeDays, streak: maxStreak };
}

// ─── Tooltip ─────────────────────────────────────────────────────

function Tooltip({
  text,
  rect,
  visible,
}: {
  text: string;
  rect: { top: number; left: number; width: number; height: number; bottom: number };
  visible: boolean;
}) {
  if (!visible || typeof window === "undefined") return null;

  const gap = 8;
  const arrowSize = 5;
  const estimatedH = 32;
  const above = rect.top > estimatedH + gap + arrowSize;

  return createPortal(
    <div
      className="fixed z-[9999] pointer-events-none transition-opacity duration-150"
      style={{
        left: rect.left + rect.width / 2,
        top: above ? rect.top - gap : rect.bottom + gap,
        transform: above ? "translateX(-50%) translateY(-100%)" : "translateX(-50%)",
      }}
    >
      <div className="relative bg-background border border-border-custom text-foreground text-[11px] font-mono px-3 py-1.5 rounded-sm whitespace-nowrap shadow-2xl backdrop-blur-md">
        {text}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            ...(above
              ? {
                  bottom: `-${arrowSize}px`,
                  borderLeft: `${arrowSize}px solid transparent`,
                  borderRight: `${arrowSize}px solid transparent`,
                  borderTop: `var(--border)`,
                }
              : {
                  top: `-${arrowSize}px`,
                  borderLeft: `${arrowSize}px solid transparent`,
                  borderRight: `${arrowSize}px solid transparent`,
                  borderBottom: `var(--border)`,
                }),
          }}
        />
      </div>
    </div>,
    document.body
  );
}

// ─── Direct-on-Canvas Heatmap Profile ─────────────────────────────

function ProfileHeatmap({
  title,
  username,
  platform,
  mode,
  setMode,
}: {
  title: string;
  username: string;
  platform: "github" | "leetcode";
  mode: number | null;
  setMode: (m: number | null) => void;
}) {
  const [weeks, setWeeks] = useState<CalendarDay[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, activeDays: 0, streak: 0 });
  const hasDataRef = useRef(false);

  const [tooltip, setTooltip] = useState<{
    text: string;
    rect: { top: number; left: number; width: number; height: number; bottom: number };
    visible: boolean;
  }>({ text: "", rect: { top: 0, left: 0, width: 0, height: 0, bottom: 0 }, visible: false });

  const fetchData = useCallback(
    async (m: number | null, forceRefresh = true) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ username });
        if (m !== null) params.set("year", String(m));
        if (forceRefresh) params.set("refresh", "1");

        const res = await fetch(`/api/${platform}/heatmap?${params}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Failed to load" }));
          throw new Error(err.error || "Failed to load");
        }

        const data = await res.json();
        let w: CalendarDay[][];

        if (platform === "github") {
          w = processGithubData(data);
        } else {
          w = processLeetcodeData(data.submissionCalendar, m);
        }

        setWeeks(w);
        setStats(computeStats(w));
        hasDataRef.current = true;
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        if (!hasDataRef.current) {
          setStats({ total: 0, activeDays: 0, streak: 0 });
        }
      } finally {
        setLoading(false);
      }
    },
    [username, platform],
  );

  useEffect(() => {
    fetchData(mode, true);
  }, [mode, fetchData]);

  const yearOptions = buildYearOptions();

  return (
    <div className="flex flex-col gap-4">
      {/* Header bar: Platform title, username, year filters, live indicator */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-3 border-b border-border-custom/50">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            {title}
          </h3>
          <a
            href={
              platform === "github"
                ? `https://github.com/${username}`
                : `https://leetcode.com/u/${username}/`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-muted hover:text-accent transition-colors flex items-center gap-1"
          >
            @{username} ↗
          </a>
          {loading && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-accent/10 text-accent border border-accent/20 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              syncing...
            </span>
          )}
        </div>

        {/* Controls: Year selector pills + refresh button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Year selector pills */}
          <div className="hidden sm:flex items-center gap-1 p-0.5 rounded-sm border border-border-custom bg-background/50">
            {yearOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setMode(opt.value)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-xs transition-colors duration-150 ${
                  opt.value === mode
                    ? "bg-accent text-background font-semibold"
                    : "text-muted hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Dropdown: mobile only */}
          <select
            value={mode === null ? "Recent" : String(mode)}
            onChange={(e) => {
              const val = e.target.value;
              setMode(val === "Recent" ? null : Number(val));
            }}
            className="sm:hidden px-2 py-1 text-[11px] font-mono bg-background border border-border-custom rounded-sm text-foreground focus:outline-none focus:border-accent cursor-pointer"
          >
            {yearOptions.map((opt) => (
              <option key={opt.label} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Refresh button */}
          <button
            onClick={() => fetchData(mode, true)}
            disabled={loading}
            className="p-1.5 border border-border-custom rounded-sm text-muted hover:text-accent hover:border-accent transition-colors duration-150 disabled:opacity-40"
            title="Refetch live data"
            aria-label="Refetch live data"
          >
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={loading ? "animate-spin text-accent" : ""}
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats row + Inline Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted py-1">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="flex items-center gap-2 font-medium text-foreground">
            <span
              className={`w-2 h-2 rounded-full ${
                platform === "github" ? "bg-[#30a14e]" : "bg-[#f4871f]"
              }`}
            />
            {stats.total.toLocaleString()}{" "}
            {platform === "github" ? "contributions" : "submissions"}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
            {stats.activeDays} days active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-accent font-bold">⚡</span>
            {stats.streak}d streak
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted select-none">
          <span>Less</span>
          <div className="flex items-center gap-[3px]">
            {COLORS[platform].map((c, i) => (
              <div
                key={i}
                className="w-[10px] h-[10px] rounded-[2px]"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Error display */}
      {error && weeks.length === 0 && !loading && (
        <div className="py-8 text-center border border-dashed border-border-custom rounded-sm">
          <p className="text-xs text-muted font-mono">{error}</p>
          <button
            onClick={() => fetchData(mode, true)}
            className="mt-2 text-xs text-accent border border-accent px-3 py-1 rounded-sm hover:bg-accent hover:text-background transition-colors font-mono"
          >
            Retry Connection
          </button>
        </div>
      )}

      {error && weeks.length > 0 && !loading && (
        <div className="border border-red-400/20 bg-red-400/[0.03] rounded-sm px-3 py-2">
          <p className="text-[10px] text-muted font-mono">
            Sync failed: {error}
            <button
              onClick={() => fetchData(mode, true)}
              className="ml-2 text-accent underline hover:no-underline"
            >
              Retry
            </button>
          </p>
        </div>
      )}

      {/* Skeleton directly on canvas */}
      {loading && weeks.length === 0 && (
        <div className="animate-pulse py-2 overflow-x-auto pb-2 scrollbar-thin">
          <div className="min-w-[790px]">
            <div className="flex ml-[32px] gap-[4px] mb-[8px]">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-[12px] h-[9px] bg-foreground/10 rounded" />
              ))}
            </div>
            <div className="flex gap-[10px]">
              <div className="grid grid-rows-7 gap-[4px]">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-[12px] w-[20px] bg-foreground/10 rounded ${
                      i % 2 === 0 ? "" : "opacity-0"
                    }`}
                  />
                ))}
              </div>
              <div
                className="flex-1 grid grid-cols-[repeat(53,12px)] gap-[4px]"
                style={{ gridTemplateRows: "repeat(7,12px)" }}
              >
                {Array.from({ length: 371 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[12px] h-[12px] bg-foreground/10 rounded-[2.5px]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Grid directly on website canvas */}
      {weeks.length > 0 && (
        <div className="transition-opacity duration-500 opacity-100">
          <HeatmapGrid
            weeks={weeks}
            type={platform}
            year={mode}
            onHover={(rect, text) => setTooltip({ text, rect, visible: true })}
            onLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
          />
        </div>
      )}

      <Tooltip text={tooltip.text} rect={tooltip.rect} visible={tooltip.visible} />
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────

export default function CodingProfiles() {
  const [ghMode, setGhMode] = useState<number | null>(null);
  const [lcMode, setLcMode] = useState<number | null>(null);

  return (
    <section
      id="profiles"
      className="scroll-mt-24 flex flex-col gap-10 fade-up-element"
    >
      {/* Uniform Section Heading */}
      <div className="border-b border-border-custom pb-4 flex items-center justify-between">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground font-normal">
          04 / Code Profiles
        </h2>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-muted">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Live Auto-Refreshed
        </span>
      </div>

      {/* Heatmap sections sitting directly on the canvas without card framing */}
      <div className="flex flex-col gap-14">
        <ProfileHeatmap
          title="GitHub Contributions"
          username={GITHUB_USER}
          platform="github"
          mode={ghMode}
          setMode={setGhMode}
        />

        {/* Minimalist hairline divider between platforms */}
        <div className="border-b border-border-custom" />

        <ProfileHeatmap
          title="LeetCode Activity"
          username={LEETCODE_USER}
          platform="leetcode"
          mode={lcMode}
          setMode={setLcMode}
        />
      </div>

      {/* Credit */}
      <p className="text-[10px] text-muted font-mono text-center leading-relaxed">
        Heatmap widgets inspired by{" "}
        <a
          href="https://github.com/TheAyushTandon/Stepcode-heatmaps"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline decoration-accent/30 hover:decoration-accent transition-colors"
        >
          Stepcode-heatmaps
        </a>{" "}
        by <span className="text-foreground">TheAyushTandon</span>
      </p>
    </section>
  );
}
