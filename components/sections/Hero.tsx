"use client";

import { useRef } from "react";
import Image from "next/image";
import dataJson from "@/data/data.json";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MorphingText } from "@/components/MorphingText";

const MORPH_TERMS = [
  "AI Engineer",
  "Full Stack Developer",
  "Tech Hobbyist",
  "Problem Solver",
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-gsap-left", {
        x: -30,
        opacity: 0,
        duration: 0.9,
      }).from(
        ".hero-gsap-right",
        {
          x: 30,
          opacity: 0,
          scale: 0.95,
          duration: 1,
        },
        "-=0.6"
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[72vh] pt-16 sm:pt-20 pb-8 flex items-center justify-center select-none"
    >
      {/* Background Ambient Blur Glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 rounded-full blur-3xl pointer-events-none opacity-[0.07] select-none"
        style={{
          width: "clamp(300px, 50vw, 600px)",
          height: "clamp(300px, 50vw, 600px)",
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full max-w-6xl mx-auto px-4 sm:px-6 z-10">
        {/* ─── LEFT COLUMN: Text Content & Actions ─── */}
        <div className="hero-gsap-left lg:col-span-7 flex flex-col items-start text-left gap-6">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border-custom bg-card/60 font-mono text-xs text-muted shadow-xs">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>AI ENGINEER & FULL STACK DEVELOPER</span>
          </div>

          {/* Headline & Morphing Role Line */}
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
              Hi, I'm <span className="text-accent italic font-normal">Gyanendra Prakash</span>
            </h1>

            <div className="flex items-center gap-2.5 font-mono text-sm sm:text-base text-muted pt-1">
              <span className="text-accent font-bold">✦</span>
              <span>Building as:</span>
              <div className="relative inline-flex items-center h-7 min-w-[220px]">
                <MorphingText texts={MORPH_TERMS} />
              </div>
            </div>
          </div>

          {/* Description Narrative */}
          <p className="text-sm sm:text-base leading-relaxed text-muted font-mono max-w-xl">
            {dataJson.description}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1 font-mono text-xs sm:text-sm font-semibold">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 border border-accent bg-accent text-background px-5 py-2.5 rounded-sm hover:opacity-90 transition-all duration-200 shadow-sm"
            >
              <span>View Projects</span>
              <span>↓</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-border-custom bg-card/60 text-foreground px-5 py-2.5 rounded-sm hover:border-accent hover:text-accent transition-colors duration-200"
            >
              <span>Let's Talk</span>
              <span>↗</span>
            </a>
          </div>

          {/* Tech Skill Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border-custom/60 w-full">
            <span className="text-xs font-mono text-muted mr-2">TECH:</span>
            {["React", "Next.js", "Python", "LLMs & AI", "Docker"].map((label) => (
              <span
                key={label}
                className="badge-pill text-[11px] font-mono border border-border-custom bg-card/40 px-2.5 py-1 rounded-sm text-foreground hover:border-accent/40 transition-colors"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Single High-Res Portrait Photo ─── */}
        <div className="hero-gsap-right lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative group w-full max-w-[350px] sm:max-w-[380px]">
            {/* Single Photo Frame Card */}
            <div className="relative rounded-2xl overflow-hidden border border-border-custom bg-card shadow-2xl transition-all duration-500 hover:border-accent/40">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/p1.png"
                  alt="Gyanendra Prakash"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 350px, 380px"
                  className="object-cover object-top grayscale contrast-115 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              </div>

              {/* Bottom Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10 bg-card/90 backdrop-blur-md border border-border-custom px-3.5 py-1.5 rounded-lg shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-foreground">
                    GYANENDRA PRAKASH
                  </span>
                </div>
                <span className="text-[10px] font-mono text-accent font-semibold">
                  2026 ✦
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
