"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dataJson from "@/data/data.json";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MorphingText } from "@/components/MorphingText";

type OrbitBadgeDef = {
  label: string;
  icon: React.ReactNode;
  angleDeg: number;
};

function SvgIcon({ children, viewBox = "0 0 20 20" }: { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-80">
      {children}
    </svg>
  );
}

const icons = {
  React: (
    <SvgIcon>
      <ellipse cx="10" cy="10" rx="8.5" ry="3.5" transform="rotate(0 10 10)" />
      <ellipse cx="10" cy="10" rx="8.5" ry="3.5" transform="rotate(60 10 10)" />
      <ellipse cx="10" cy="10" rx="8.5" ry="3.5" transform="rotate(120 10 10)" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none" />
    </SvgIcon>
  ),
  Python: (
    <SvgIcon>
      <path d="M7 3h6a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H7a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h6" />
      <path d="M7 14v-2a2 2 0 0 1 2-2h4a2 2 0 0 0 2-2V5" />
    </SvgIcon>
  ),
  Git: (
    <SvgIcon>
      <path d="M12 3v8a3 3 0 0 1-3 3H6" />
      <path d="M9 6 6 9l3 3" />
      <circle cx="4" cy="16" r="2" />
      <circle cx="16" cy="16" r="2" />
      <path d="M12 8h4a2 2 0 0 1 2 2v6" />
    </SvgIcon>
  ),
  PostgreSQL: (
    <SvgIcon>
      <ellipse cx="10" cy="8" rx="6" ry="3" />
      <path d="M4 8v5c0 1.5 2.7 3 6 3s6-1.5 6-3V8" />
      <circle cx="10" cy="8" r="1.5" fill="currentColor" stroke="none" />
    </SvgIcon>
  ),
  LLMs: (
    <SvgIcon>
      <circle cx="10" cy="3" r="1.8" />
      <circle cx="3" cy="10" r="1.8" />
      <circle cx="10" cy="17" r="1.8" />
      <circle cx="17" cy="10" r="1.8" />
      <line x1="8.5" y1="4.5" x2="4.5" y2="8.5" />
      <line x1="11.5" y1="4.5" x2="15.5" y2="8.5" />
      <line x1="8.5" y1="15.5" x2="4.5" y2="11.5" />
      <line x1="11.5" y1="15.5" x2="15.5" y2="11.5" />
    </SvgIcon>
  ),
  Nextjs: (
    <SvgIcon viewBox="0 0 20 20">
      <rect x="2" y="2" width="16" height="16" rx="3" />
      <path d="M7 7v6" />
      <path d="M16 7l-6 6" />
    </SvgIcon>
  ),
  Docker: (
    <SvgIcon>
      <rect x="2" y="9" width="4" height="4" rx="1" />
      <rect x="8" y="9" width="4" height="4" rx="1" />
      <rect x="14" y="9" width="4" height="4" rx="1" />
      <rect x="5" y="5" width="4" height="4" rx="1" />
      <rect x="11" y="5" width="4" height="4" rx="1" />
    </SvgIcon>
  ),
  TypeScript: (
    <SvgIcon viewBox="0 0 20 20">
      <rect x="2" y="2" width="16" height="16" rx="2" fill="currentColor" stroke="none" />
      <path d="M5 10h4m-2-3v6" stroke="#fff" />
      <path d="M12 12c.4.6 1.2 1 2 1s1.5-.4 1.5-1-.5-.9-1.2-1.1l-.6-.2c-1-.3-1.8-1-1.8-2.1s.9-2 2.1-2c.8 0 1.5.3 2 .8" stroke="#fff" />
    </SvgIcon>
  ),
} satisfies Record<string, React.ReactNode>;

// 8 Orbit Badges spaced evenly around 360 deg
const orbitBadges: OrbitBadgeDef[] = [
  { label: "React",       icon: icons.React,      angleDeg: 0 },
  { label: "Next.js",     icon: icons.Nextjs,     angleDeg: 45 },
  { label: "Python",      icon: icons.Python,     angleDeg: 90 },
  { label: "TypeScript",  icon: icons.TypeScript, angleDeg: 135 },
  { label: "LLMs",        icon: icons.LLMs,       angleDeg: 180 },
  { label: "Docker",      icon: icons.Docker,     angleDeg: 225 },
  { label: "PostgreSQL",  icon: icons.PostgreSQL, angleDeg: 270 },
  { label: "Git",         icon: icons.Git,        angleDeg: 315 },
];

const MORPH_TERMS = [
  "Gyanendra",
  "AI Engineer",
  "Full Stack Developer",
  "Tech Hobbyist",
  "Problem Solver",
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [orbitRadius, setOrbitRadius] = useState({ rx: 330, ry: 205 });

  // Calculate dynamic responsive orbit radii so badges float cleanly outside photo cards
  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth;
      const cardW = Math.max(160, Math.min(w * 0.3, 340));
      const stackHalfW = cardW * 0.8;
      const rx = Math.max(280, stackHalfW + 85);
      const ry = Math.max(175, cardW * 0.68);
      setOrbitRadius({ rx, ry });
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      // ─── Staggered Entrance Animation ───
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-gsap-photo", {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 1.1,
      })
        .from(
          ".hero-gsap-title",
          {
            y: 35,
            opacity: 0,
            duration: 0.9,
          },
          "-=0.7"
        )
        .from(
          ".hero-gsap-desc",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative flex items-center justify-center min-h-[90vh] pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden select-none"
    >
      {/* ─── Centered Content Column ─── */}
      <div className="relative z-20 flex flex-col items-center text-center gap-8 md:gap-10 px-5 max-w-4xl mx-auto w-full">

        {/* ─── Photo Stack & Revolving Orbit Container ─── */}
        <div className="hero-gsap-photo relative flex items-center justify-center w-full py-6 my-2">
          
          {/* Static Ambient Glow centered directly behind photos */}
          <div
            className="absolute rounded-full blur-3xl pointer-events-none opacity-[0.09] select-none"
            style={{
              width: "clamp(300px, 50vw, 550px)",
              height: "clamp(300px, 50vw, 550px)",
              background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          {/* Orbit Badges Ring (Revolving smoothly outside photo cards) */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-20 overflow-visible" aria-hidden="true">
            <div className="animate-orbit-ring absolute inset-0 flex items-center justify-center">
              {orbitBadges.map((b) => {
                const rad = (b.angleDeg * Math.PI) / 180;
                const x = Math.cos(rad) * orbitRadius.rx;
                const y = Math.sin(rad) * orbitRadius.ry;

                return (
                  <div
                    key={b.label}
                    className="absolute pointer-events-auto"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    {/* Counter rotate each badge so icon & text stay upright */}
                    <div className="animate-badge-upright">
                      <span className="badge-pill group transition-all duration-300 hover:border-accent hover:text-accent hover:scale-110 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]">
                        {b.icon}
                        <span>{b.label}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Photo Stack */}
          <div
            className="relative z-10 flex items-center justify-center cursor-default"
            style={{
              "--card-w": "clamp(160px, 30vw, 340px)",
            } as React.CSSProperties}
          >
            {/* Left photo */}
            <div
              className="photo-card relative shrink-0 z-10"
              style={{
                width: "var(--card-w)",
                height: "calc(var(--card-w) * 1.285)",
                rotate: "-3deg",
                animation: "float-bob-1 7s ease-in-out 0.9s infinite",
              }}
            >
              <Image
                src="/p1.png"
                alt="Gyanendra Prakash"
                fill
                priority
                sizes="(max-width: 600px) 160px, (max-width: 900px) 230px, 340px"
                className="object-cover object-top grayscale contrast-115 transition-all duration-500 hover:grayscale-0 hover:scale-105"
              />
            </div>
            {/* Right photo */}
            <div
              className="photo-card relative shrink-0"
              style={{
                width: "var(--card-w)",
                height: "calc(var(--card-w) * 1.285)",
                marginLeft: "calc(var(--card-w) * -0.4)",
                rotate: "3deg",
                animation: "float-bob-2 8s ease-in-out 0.9s infinite",
              }}
            >
              <Image
                src="/p2.png"
                alt="Gyanendra Prakash"
                fill
                priority
                sizes="(max-width: 600px) 160px, (max-width: 900px) 230px, 340px"
                className="object-cover object-top transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* ─── Morphing Title Heading ─── */}
        <h1
          className="hero-gsap-title font-serif text-foreground leading-[1.08] tracking-tight flex flex-col items-center justify-center text-center w-full"
          style={{
            fontSize: "clamp(2.5rem, 9vw, 5.75rem)",
          }}
        >
          <span>{"Hi, I'm"}</span>
          <div className="relative flex items-center justify-center w-full min-h-[1.25em] mt-1">
            <MorphingText texts={MORPH_TERMS} />
          </div>
        </h1>

        {/* ─── Description ─── */}
        <p className="hero-gsap-desc max-w-2xl text-sm md:text-base leading-relaxed text-muted font-mono">
          {dataJson.description}
        </p>

        {/* ─── Mobile Badge Row ─── */}
        <div className="flex md:hidden flex-wrap justify-center gap-2 mt-1">
          {["React", "Python", "Git", "LLMs", "Docker"].map((label) => (
            <span key={label} className="badge-pill text-[10px]">
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
