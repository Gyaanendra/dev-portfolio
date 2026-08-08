"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setTimeStr(now.toLocaleTimeString("en-US", options) + " IST");
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const marqueeText =
    "LET'S BUILD SOMETHING MAGICAL ✦ OPEN FOR AI ROLES & FREELANCE BUILDS ✦ HYDERABAD / NOIDA ✦ AVAILABLE 2026 ✦ ";

  return (
    <footer className="relative w-full border-t border-border-custom mt-20 pt-6 pb-12 text-xs font-mono bg-card/20 overflow-hidden">
      {/* ─── Large Faded Background Name Watermark ─── */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center select-none pointer-events-none opacity-[0.05] dark:opacity-[0.07] w-full px-4 z-0">
        <svg viewBox="0 0 1000 140" className="w-full h-auto max-h-[22vh]">
          <text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            fill="currentColor"
            className="font-serif font-bold text-[85px] tracking-tight"
          >
            Gyanendra Prakash
          </text>
        </svg>
      </div>

      {/* ─── Infinite Moving Marquee Loop Banner ─── */}
      <div className="relative z-10 w-full overflow-hidden border-b border-border-custom/60 pb-5 mb-8 select-none">
        <div className="animate-marquee whitespace-nowrap text-xs font-bold text-accent tracking-widest uppercase">
          <span>{marqueeText.repeat(8)}</span>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left: Copyright */}
        <div className="flex items-center gap-2 text-muted text-[11px]">
          <span>© {new Date().getFullYear()} Gyanendra Prakash.</span>
          <span className="hidden sm:inline">Built with Next.js, React 19 & GSAP.</span>
        </div>

        {/* Middle: Live Time Clock in IST */}
        <div className="flex items-center gap-2 border border-border-custom px-3 py-1 rounded-full bg-card/80 backdrop-blur-md text-[11px] text-foreground">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>LOCAL TIME:</span>
          <span className="font-bold text-accent">{timeStr || "16:40 IST"}</span>
        </div>

        {/* Right: Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-1.5 border border-border-custom px-3 py-1.5 rounded-sm hover:border-accent hover:text-accent transition-colors text-[11px] text-muted hover:bg-card bg-card/60"
          title="Scroll back to top"
        >
          <span>[↑ Back to Top]</span>
        </button>
      </div>
    </footer>
  );
}
