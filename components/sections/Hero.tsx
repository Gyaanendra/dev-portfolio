"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import contactJson from "@/data/contact.json";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  PhoneIcon,
  MailIcon,
  GithubIcon,
  LinkedinIcon,
} from "@animateicons/react/lucide";

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

            {/* Tech Quote Statement */}
            <div className="flex flex-col gap-2.5 text-base sm:text-lg md:text-xl leading-relaxed text-[#000000]/85 dark:text-[#ffffff]/85 font-serif pt-1">
              <p>
                &ldquo;A <span className="italic text-accent">bug</span> is never just a mistake. It represents something bigger. An <span className="italic text-accent">error of thinking</span> that makes you who you are.&rdquo;
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-muted tracking-wider uppercase">
                <span className="text-accent font-bold">/</span>
                <span>mr. robot · eps1.2_d3bug</span>
              </div>
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
                  <span> 2026</span>

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
          <span className="w-5 h-5 rounded-full bg-[#000000] dark:bg-[#ffffff] text-[#ffffff] dark:text-[#000000] flex items-center justify-center group-hover:bg-accent group-hover:text-[#000000] transition-colors flex-shrink-0">
            <PhoneIcon size={12} className="pointer-events-none" />
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
          <span className="w-5 h-5 rounded-full bg-[#000000] dark:bg-[#ffffff] text-[#ffffff] dark:text-[#000000] flex items-center justify-center group-hover:bg-accent group-hover:text-[#000000] transition-colors flex-shrink-0">
            <MailIcon size={12} className="pointer-events-none" />
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
          <span className="w-5 h-5 rounded-full bg-[#000000] dark:bg-[#ffffff] text-[#ffffff] dark:text-[#000000] flex items-center justify-center group-hover:bg-accent group-hover:text-[#000000] transition-colors flex-shrink-0">
            <GithubIcon size={12} className="pointer-events-none" />
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
          <span className="w-5 h-5 rounded-full bg-[#000000] dark:bg-[#ffffff] text-[#ffffff] dark:text-[#000000] flex items-center justify-center group-hover:bg-accent group-hover:text-[#000000] transition-colors flex-shrink-0">
            <LinkedinIcon size={12} className="pointer-events-none" />
          </span>
          <span className="font-medium text-[#000000] dark:text-[#ffffff] group-hover:text-accent transition-colors">linkedin.com/in/gyanendra</span>
        </a>

      </div>
    </section>
  );
}
