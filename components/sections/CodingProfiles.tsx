"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import HeatmapGrid, { CalendarDay } from "@/components/HeatmapGrid";

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
  // Build date→count map
  const dateMap: Record<string, number> = {};
  for (const [ts, count] of Object.entries(submissionCalendar)) {
    const d = new Date(Number(ts) * 1000).toISOString().split("T")[0];
    dateMap[d] = (dateMap[d] || 0) + Number(count);
  }

  // Determine start date and total days
  let start: Date;
  let totalDays: number;

  if (year) {
    // Exact calendar year
    start = new Date(Date.UTC(year, 0, 1));
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());

    const end = new Date(Date.UTC(year, 11, 31));
    end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));
    totalDays = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;
  } else {
    // Past ~365 days (rolling, like GitHub)
    const today = new Date();
    const oneYearAgo = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 364),
    );
    const startDow = oneYearAgo.getUTCDay();
    start = new Date(oneYearAgo);
    start.setUTCDate(start.getUTCDate() - startDow);
    totalDays = 371; // 53 weeks
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
  x,
  y,
  visible,
}: {
  text: string;
  x: number;
  y: number;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{ left: x + 14, top: y + 14 }}
    >
      <div className="bg-foreground text-background text-[11px] font-mono px-3 py-1.5 rounded-[4px] shadow-lg whitespace-nowrap border border-border-custom">
        {text}
      </div>
    </div>
  );
}

// ─── Heatmap card ────────────────────────────────────────────────

function HeatmapCard({
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

  // Tooltip state
  const [tooltip, setTooltip] = useState({ text: "", x: 0, y: 0, visible: false });

  const fetchData = useCallback(
    async (m: number | null, forceRefresh = false) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ username });
        if (m !== null) params.set("year", String(m));
        if (forceRefresh) params.set("refresh", "1");

        const res = await fetch(`/api/${platform}/heatmap?${params}`);
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
    fetchData(mode);
  }, [mode, fetchData]);

  // Build year options dynamically
  const yearOptions = buildYearOptions();

  return (
    <div className="glow-card border border-border-custom bg-card rounded-sm p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-[11px] text-muted font-mono mt-0.5">@{username}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Year selector — pills matching Stepcode style */}
          <div className="flex border border-border-custom rounded-sm overflow-hidden">
            {yearOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setMode(opt.value)}
                className={`px-2.5 py-1 text-[11px] font-mono font-medium transition-colors duration-150 ${
                  opt.value === mode
                    ? "bg-accent text-background"
                    : "text-muted hover:text-foreground hover:bg-card"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={() => fetchData(mode, true)}
            disabled={loading}
            className="p-1.5 border border-border-custom rounded-sm text-muted hover:text-foreground hover:border-accent transition-colors duration-150 disabled:opacity-40"
            title="Refresh data"
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={loading ? "animate-spin" : ""}
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-xs font-mono text-muted">
        <span className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${platform === "github" ? "bg-[#30a14e]" : "bg-[#f4871f]"}`}
          />
          {stats.total.toLocaleString()} total
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-foreground/20" />
          {stats.activeDays} days active
        </span>
        <span className="flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-accent"
          >
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {stats.streak}d streak
        </span>
      </div>

      {/* Error — full page on fresh load */}
      {error && weeks.length === 0 && !loading && (
        <div className="py-8 text-center">
          <p className="text-xs text-muted font-mono">{error}</p>
          <button
            onClick={() => fetchData(mode, true)}
            className="mt-2 text-xs text-accent border border-accent px-3 py-1 rounded-sm hover:bg-accent hover:text-background transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Error — soft banner when old data exists */}
      {error && weeks.length > 0 && !loading && (
        <div className="mb-3 border border-red-400/20 bg-red-400/[0.03] rounded-sm px-3 py-2">
          <p className="text-[10px] text-muted font-mono">
            Refresh failed: {error}
            <button
              onClick={() => fetchData(mode, true)}
              className="ml-2 text-accent underline hover:no-underline"
            >
              Retry
            </button>
          </p>
        </div>
      )}

      {/* Skeleton */}
      {loading && weeks.length === 0 && (
        <div className="animate-pulse bg-[var(--card-bg)] border border-[var(--border)] rounded-sm p-3 md:p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border)]">
            <div className="h-3 w-28 bg-foreground/10 rounded" />
            <div className="flex gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[10px] h-[10px] bg-foreground/10 rounded-[2.5px]" />
              ))}
            </div>
          </div>
          <div className="flex ml-[30px] gap-[4px] mb-[6px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-[12px] h-[9px] bg-foreground/8 rounded" />
            ))}
          </div>
          <div className="flex gap-[8px]">
            <div className="grid grid-rows-7 gap-[4px]">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={`h-[12px] w-[20px] bg-foreground/8 rounded ${i % 2 === 0 ? "" : "opacity-0"}`} />
              ))}
            </div>
            <div className="flex-1 grid grid-cols-[repeat(53,12px)] gap-[4px]" style={{ gridTemplateRows: "repeat(7,12px)" }}>
              {Array.from({ length: 371 }).map((_, i) => (
                <div key={i} className="w-[12px] h-[12px] bg-foreground/8 rounded-[3.5px]" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Heatmap */}
      {weeks.length > 0 && (
        <HeatmapGrid
          weeks={weeks}
          type={platform}
          year={mode}
          onHover={(e, text) => setTooltip({ text, x: e.clientX, y: e.clientY, visible: true })}
          onLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
        />
      )}

      {/* Floating tooltip */}
      <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} visible={tooltip.visible} />
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────

export default function CodingProfiles() {
  const [ghMode, setGhMode] = useState<number | null>(null);
  const [lcMode, setLcMode] = useState<number | null>(null);

  return (
    <section id="profiles" className="scroll-mt-24 flex flex-col gap-8 fade-up-element">
      <div className="border-b border-border-custom pb-4">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight font-normal">
          04 / Code Profiles
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        <HeatmapCard
          title="GitHub Contributions"
          username={GITHUB_USER}
          platform="github"
          mode={ghMode}
          setMode={setGhMode}
        />
        <HeatmapCard
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
        by{" "}
        <span className="text-foreground">TheAyushTandon</span>
      </p>
    </section>
  );
}
