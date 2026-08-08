"use client";

import { useState } from "react";
import Image from "next/image";
import dataJson from "@/data/data.json";

export default function About() {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Mouse & Touch Drag Handlers
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartPos({ x: clientX - dragOffset.x, y: clientY - dragOffset.y });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setDragOffset({
      x: clientX - startPos.x,
      y: clientY - startPos.y,
    });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  return (
    <section
      id="about"
      className="scroll-mt-28 flex flex-col gap-8 fade-up-element pt-8 pb-6 sm:py-6"
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={(e) => {
        if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchEnd={handleEnd}
    >
      {/* Header */}
      <div className="border-b border-border-custom pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div className="flex items-baseline gap-2">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight text-foreground">
            ABOUT <span className="italic font-normal text-accent">ME</span>
          </h2>
        </div>
        <span className="text-xs font-mono text-muted">
          ( The developer behind the pixels & models )
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Visual Area (Main B&W Photo + Draggable Polaroid overlay) */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-start pt-6 sm:pt-4">
          <div className="relative group w-full max-w-[340px] sm:max-w-[380px]">
            {/* Main B&W Photo Card */}
            <div className="relative rounded-xl overflow-hidden border border-border-custom bg-card shadow-md">
              <div className="relative aspect-[4/4.8] w-full">
                <Image
                  src={dataJson.avatarUrl || "/images/me1.jpg"}
                  alt="Gyanendra Prakash"
                  fill
                  className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                  priority
                />
              </div>

              {/* Bottom Sticker Pill */}
              <div className="absolute bottom-3 left-3 z-10 bg-card/90 backdrop-blur-md border border-border-custom px-3 py-1 rounded-full shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-wider uppercase text-foreground">
                  YES, THAT'S ME ⚡
                </span>
              </div>
            </div>

            {/* Draggable Tilted Polaroid Photo (Mouse & Touch Enabled) */}
            <div
              onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
              onTouchStart={(e) => {
                if (e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY);
              }}
              style={{
                transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(6deg)`,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              className="absolute -top-6 right-0 sm:-top-5 sm:-right-6 w-32 sm:w-44 bg-white text-black p-2 rounded-sm shadow-xl border border-black/10 z-30 transition-shadow duration-200 select-none hover:scale-105 touch-none"
            >
              {/* Tape Label */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-accent text-background text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 shadow-sm rotate-[-2deg]">
                DRAG ME 📌
              </div>

              <div className="relative aspect-[4/3] w-full bg-neutral-200 overflow-hidden rounded-xs border border-black/10">
                <Image
                  src="/images/fun/dayout1.jpg"
                  alt="Gyanendra Day Out"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-1.5 text-center font-mono text-[9px] font-medium text-neutral-800 tracking-tight">
                @gyanendra ✦ 2026
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area (Quote + Narrative + Resume + 3-Column Grid) */}
        <div className="lg:col-span-7 flex flex-col gap-6 pt-2 sm:pt-0">
          {/* Statement Quote */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-serif leading-relaxed text-foreground">
            I believe intelligent software should feel like <span className="italic font-normal text-accent">magic</span> — it's the moment an AI agent <span className="italic font-normal text-accent">actually</span> solves a problem, the server that <span className="italic font-normal text-accent">never</span> crashes, and the interface that <span className="italic font-normal text-accent">delights</span> every user.
          </h3>

          {/* Narrative Summary */}
          <div className="text-xs sm:text-sm leading-relaxed text-muted space-y-3 font-mono">
            <p>
              I'm <strong className="text-foreground">Gyanendra Prakash</strong>, a 2nd-year B.Tech Computer Science Engineering student at <strong className="text-foreground">Bennett University</strong>, passionate about building autonomous AI agents, LLM integrations, and scalable full-stack web applications.
            </p>
            <p>
              I have <span className="text-accent font-semibold">won 3 hackathons</span>, self-host a cloud-based <strong className="text-foreground">Hermes AI agent</strong>, and converted a repurposed desktop PC into my own home server. When I'm not coding, I'm gaming, exploring movies, or trying new recipes in the kitchen.
            </p>
          </div>

          {/* Minimalist Resume Button */}
          <div>
            <a
              href="/resume.pdf"
              download="Gyanendra_Prakash_Resume.pdf"
              className="inline-flex items-center gap-2 border border-accent text-accent font-mono text-xs font-semibold px-4 py-2 rounded-sm bg-card/40 hover:bg-accent hover:text-background transition-colors duration-200"
            >
              <span>Download Engineering Resume</span>
              <span className="text-[10px]">↓</span>
            </a>
          </div>

          {/* 3-Column Subgrid (Responsive Stacking) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5 border-t border-border-custom font-mono">
            <div className="border-b sm:border-b-0 border-border-custom/50 pb-4 sm:pb-0">
              <h4 className="text-xs uppercase font-bold tracking-widest text-accent mb-2">
                01 / AI & LLMS
              </h4>
              <ul className="text-xs text-muted space-y-1">
                <li>AI Agents & Fine-Tuning</li>
                <li>RAG & Vector Search</li>
                <li>Prompt Craft & Ollama</li>
                <li>PyTorch & HuggingFace</li>
              </ul>
            </div>

            <div className="border-b sm:border-b-0 border-border-custom/50 pb-4 sm:pb-0">
              <h4 className="text-xs uppercase font-bold tracking-widest text-accent mb-2">
                02 / FULL STACK
              </h4>
              <ul className="text-xs text-muted space-y-1">
                <li>Next.js & React</li>
                <li>FastAPI & Python</li>
                <li>PostgreSQL & Firebase</li>
                <li>TailwindCSS & GSAP</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold tracking-widest text-accent mb-2">
                03 / BUILDER
              </h4>
              <ul className="text-xs text-muted space-y-1">
                <li>3x Hackathon Winner</li>
                <li>Self-Hosted Linux Server</li>
                <li>Docker & Cloud Deployment</li>
                <li>Agentic Workflows</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
