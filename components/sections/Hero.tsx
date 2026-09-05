"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import contactJson from "@/data/contact.json";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface SkillItem {
  id: string;
  symbol: string;
  name: string;
}

const SKILLS_TILES: SkillItem[] = [
  { id: "python", symbol: "Py", name: "Python" },
  { id: "react", symbol: "Re", name: "React" },
  { id: "nextjs", symbol: "Nx", name: "Next.js" },
  { id: "ai", symbol: "AI", name: "LLMs & AI" },
  { id: "typescript", symbol: "Ts", name: "TypeScript" },
  { id: "docker", symbol: "Dk", name: "Docker" },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-portrait-col", {
        opacity: 0,
        x: -30,
        duration: 0.8,
      })
        .from(
          ".hero-center-col",
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          ".hero-right-col",
          {
            opacity: 0,
            x: 30,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          ".hero-footer-bar",
          {
            opacity: 0,
            y: 15,
            duration: 0.6,
          },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{ fontFamily: "var(--font-trt-interval), 'TRT INTERVAL', monospace" }}
      className="relative w-full pt-2 sm:pt-4 pb-12 flex flex-col select-none text-[#000000] dark:text-[#ffffff]"
    >
      {/* ─── 3-COLUMN CONTENT GRID (Placed directly on the page, no outer card container) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-stretch w-full">
        
        {/* ─── COLUMN 1 (LEFT): Rounded Portrait Photo (Clean Authentic Treatment) ─── */}
        <div className="hero-portrait-col lg:col-span-4 flex items-center justify-center">
          <div className="relative w-full h-[360px] sm:h-[440px] lg:h-full min-h-[400px] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#9C9C9C]/10 border border-[#9C9C9C]/20 shadow-sm group">
            <Image
              src="/images/hero.jpg"
              alt="Gyanendra Prakash"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 380px"
              className="object-cover object-[center_28%] grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
            />
            {/* Subtle splash hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </div>

        {/* ─── COLUMN 2 (CENTER): Intro & Bio Narrative ─── */}
        <div className="hero-center-col lg:col-span-5 flex flex-col justify-start gap-6 sm:gap-8">
          {/* Top Block: Greeting + Bio */}
          <div className="flex flex-col gap-4">
            {/* Header: Strong hook with name */}
            <div>
              <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight font-serif leading-none text-[#000000] dark:text-[#ffffff]">
                Hi, I&apos;m Gyanendra.
              </h1>
            </div>

            {/* Bio Narrative (Monochromatic text with vibrant accent) */}
            <div className="flex flex-col gap-3 text-sm sm:text-base leading-relaxed text-[#000000]/80 dark:text-[#ffffff]/80">
              <p>
                My name is <strong className="font-semibold text-[#000000] dark:text-[#ffffff]">Gyanendra Prakash</strong>. My strengths are <span className="font-semibold text-[#000000] dark:text-[#ffffff] border-b-2 border-accent">AI Engineering</span>, <strong className="font-semibold text-[#000000] dark:text-[#ffffff]">Full Stack Development</strong> and <strong className="font-semibold text-[#000000] dark:text-[#ffffff]">Intelligent Agents</strong>. I love building autonomous systems and storytelling through code. I look forward to contributing my creativity and technical skills to innovative projects.
              </p>
              <p className="font-medium text-[#9C9C9C]">
                Hope you enjoy my portfolio!
              </p>
            </div>
          </div>
        </div>

        {/* ─── COLUMN 3 (RIGHT): SKILLS Grid + EXPERIENCE (matching reference placement) ─── */}
        <div className="hero-right-col lg:col-span-3 flex flex-col justify-between gap-6 sm:gap-8">
          
          {/* Top Block: CORE STACK Heading & 3x2 Grid */}
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide font-serif text-[#000000] dark:text-[#ffffff]">
                CORE STACK
              </h2>
              <span className="text-[10px] text-accent font-semibold tracking-wider uppercase">
                DAILY DRIVERS
              </span>
            </div>

            {/* 3x2 Grid of Monochromatic Badges with Splash Accent */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-[210px]">
              {SKILLS_TILES.map((skill) => (
                <div
                  key={skill.id}
                  onMouseEnter={() => setActiveTooltip(skill.name)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="relative aspect-square rounded-[14px] sm:rounded-2xl bg-[#000000] dark:bg-[#111111] text-[#ffffff] flex items-center justify-center font-bold text-base sm:text-lg shadow-sm border border-[#9C9C9C]/30 hover:border-accent hover:scale-105 transition-all duration-200 cursor-pointer select-none group"
                  title={skill.name}
                >
                  <span className="tracking-tight group-hover:text-accent transition-colors">
                    {skill.symbol}
                  </span>

                  {/* Subtle splash dot indicator on hover */}
                  <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>

            {/* Dynamic skill name preview */}
            <div className="h-4 text-xs font-mono text-[#9C9C9C]">
              {activeTooltip ? (
                <span className="text-[#000000] dark:text-[#ffffff] font-medium">
                  ✦ {activeTooltip}
                </span>
              ) : (
                "Hover badges to inspect"
              )}
            </div>
          </div>

          {/* Bottom Block of Right Column: EXPERIENCE (matching reference placement) */}
          <div className="flex flex-col gap-3 pt-2">
            <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide font-serif text-[#000000] dark:text-[#ffffff]">
              EXPERIENCE
            </h2>

            <div className="flex flex-col gap-3.5">
              {/* Role 1 */}
              <div>
                <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-[#000000] dark:text-[#ffffff]">
                  <span>May 2026 – Aug 2026</span>
                  <span className="text-[10px] font-mono font-semibold text-accent border border-accent/60 px-1.5 py-0.2 rounded-xs uppercase tracking-wider">
                    Incoming
                  </span>
                </div>
                <div className="text-sm sm:text-base text-[#9C9C9C] dark:text-[#b0b0b0]">
                  Full Stack AI Engineer at Hypotenuse Analytics
                </div>
              </div>

              {/* Role 2 */}
              <div>
                <div className="text-base sm:text-lg font-bold text-[#000000] dark:text-[#ffffff]">
                  2025
                </div>
                <div className="text-sm sm:text-base text-[#9C9C9C] dark:text-[#b0b0b0]">
                  Backend Django Intern at Ezlearn
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ─── BOTTOM ROW: Footer Contact Strip (Matching Reference Placement) ─── */}
      <div className="hero-footer-bar mt-10 sm:mt-12 pt-6 border-t border-[#9C9C9C]/25 flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-xs sm:text-sm text-[#9C9C9C]">
        
        {/* 1. Phone */}
        <button
          onClick={() => handleCopy(contactJson.contact.tel, "phone")}
          className="flex items-center gap-2.5 text-[#000000] dark:text-[#ffffff] hover:text-accent transition-colors cursor-pointer group"
          title="Click to copy phone number"
        >
          <span className="w-5 h-5 rounded-full bg-[#000000] dark:bg-[#ffffff] text-[#ffffff] dark:text-[#000000] flex items-center justify-center p-1 group-hover:bg-accent group-hover:text-[#000000] transition-colors flex-shrink-0">
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
            </svg>
          </span>
          <span className="font-medium text-[#000000] dark:text-[#ffffff] group-hover:text-accent transition-colors">{contactJson.contact.tel}</span>
          {copiedItem === "phone" && (
            <span className="text-[10px] font-mono text-accent">✓ copied!</span>
          )}
        </button>

        {/* 2. Email */}
        <button
          onClick={() => handleCopy(contactJson.contact.email, "email")}
          className="flex items-center gap-2.5 text-[#000000] dark:text-[#ffffff] hover:text-accent transition-colors cursor-pointer group"
          title="Click to copy email address"
        >
          <span className="w-5 h-5 rounded-full bg-[#000000] dark:bg-[#ffffff] text-[#ffffff] dark:text-[#000000] flex items-center justify-center p-1 group-hover:bg-accent group-hover:text-[#000000] transition-colors flex-shrink-0">
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </span>
          <span className="font-medium text-[#000000] dark:text-[#ffffff] group-hover:text-accent transition-colors">{contactJson.contact.email}</span>
          {copiedItem === "email" && (
            <span className="text-[10px] font-mono text-accent">✓ copied!</span>
          )}
        </button>

        {/* 3. GitHub */}
        <a
          href={contactJson.contact.social.GitHub.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-[#000000] dark:text-[#ffffff] hover:text-accent transition-colors group"
        >
          <span className="w-5 h-5 rounded-full bg-[#000000] dark:bg-[#ffffff] text-[#ffffff] dark:text-[#000000] flex items-center justify-center p-1 group-hover:bg-accent group-hover:text-[#000000] transition-colors flex-shrink-0">
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </span>
          <span className="font-medium text-[#000000] dark:text-[#ffffff] group-hover:text-accent transition-colors">github.com/Gyaanendra</span>
        </a>

        {/* 4. LinkedIn */}
        <a
          href={contactJson.contact.social.LinkedIn.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-[#000000] dark:text-[#ffffff] hover:text-accent transition-colors group"
        >
          <span className="w-5 h-5 rounded-full bg-[#000000] dark:bg-[#ffffff] text-[#ffffff] dark:text-[#000000] flex items-center justify-center p-1 group-hover:bg-accent group-hover:text-[#000000] transition-colors flex-shrink-0">
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </span>
          <span className="font-medium text-[#000000] dark:text-[#ffffff] group-hover:text-accent transition-colors">linkedin.com/in/gyanendra</span>
        </a>

      </div>
    </section>
  );
}
