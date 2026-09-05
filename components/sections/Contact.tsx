"use client";

import { useState } from "react";
import contactJson from "@/data/contact.json";

export default function Contact() {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const socialLinks = [
    [
      { label: "GITHUB", href: contactJson.contact.social.GitHub.url },
      { label: "LEETCODE", href: "https://leetcode.com/u/gyaanendra/" },
    ],
    [
      { label: "LINKEDIN", href: contactJson.contact.social.LinkedIn.url },
      { label: "TWITTER (X)", href: contactJson.contact.social.X.url },
    ],
    [
      { label: "RESUME", href: "/resume.pdf" },
      { label: "MAIL", href: `mailto:${contactJson.contact.email}` },
    ],
  ];

  return (
    <section id="contact" className="scroll-mt-24 py-10 sm:py-16 md:py-20 fade-up-element w-full group">
      {/* Top Monogram & Menu Bar */}
      <div className="flex items-center justify-between w-full">
        {/* Circular/Oval Monogram Badge (like the 'A' badge in reference) */}
        <div className="flex items-center justify-center w-12 h-7 sm:w-14 sm:h-8 rounded-full border border-border-custom text-xs sm:text-sm font-serif font-black tracking-tighter hover:border-accent hover:text-accent transition-colors select-none text-foreground">
          GP
        </div>

        {/* Minimalist 2-line Icon on right */}
        <div className="flex flex-col gap-1.5 w-6 sm:w-7 items-end justify-center">
          <span className="w-full h-[1.5px] bg-foreground rounded-full" />
          <span className="w-full h-[1.5px] bg-foreground rounded-full" />
        </div>
      </div>

      {/* ─── SECTION HEADING: 09 / Contact + ARROW (Uniform with all sections) ─── */}
      <div className="border-b border-border-custom pb-4 flex items-baseline justify-between gap-4 mt-6 sm:mt-8 md:mt-10 mb-8 sm:mb-12">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground">
          09 / Contact
        </h2>

        {/* Down-Right Giant Arrow (Matching Reference Placement) */}
        <div className="text-foreground shrink-0 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 stroke-current fill-none stroke-[2.5]"
            viewBox="0 0 24 24"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <polyline points="8 18 18 18 18 8" />
          </svg>
        </div>
      </div>

      {/* ─── MIDDLE CONTENT ROW: SCULPTURAL IMAGE + TABULAR INFO ─── */}
      <div className="flex flex-col md:flex-row items-stretch gap-6 sm:gap-8 md:gap-10 lg:gap-12 pb-10 sm:pb-14">
        
        {/* Left: Tactile AI Monolithic Sculpture Image */}
        <div className="relative w-full sm:w-56 md:w-48 lg:w-60 aspect-[3/4] rounded-sm overflow-hidden border border-border-custom shrink-0 bg-card shadow-sm">
          <img
            src="/images/ai-sculpture.jpg"
            alt="Neural AI Organic Sculpture"
            className="w-full h-full object-cover grayscale contrast-125 hover:scale-105 transition-transform duration-700"
          />
          {/* Artistic badge overlay */}
          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-xs bg-black/80 backdrop-blur-md text-white text-[9px] font-mono tracking-widest uppercase border border-white/10">
            AI INTEL / MONOLITH
          </div>
        </div>

        {/* Right: Tabular Info Rows with hairline dividers */}
        <div className="flex-1 flex flex-col justify-center">
          
          {/* Row 1: PHONE */}
          <div
            onClick={() => handleCopy(contactJson.contact.tel, "phone")}
            className="group/row flex items-center justify-between py-4 sm:py-5 border-t border-border-custom hover:border-accent transition-colors cursor-pointer"
            title="Click to copy phone number"
          >
            <span className="font-sans font-bold text-xs sm:text-sm md:text-base tracking-widest uppercase text-muted group-hover/row:text-accent transition-colors">
              PHONE
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium text-xs sm:text-sm md:text-base text-foreground group-hover/row:text-accent transition-colors">
                {contactJson.contact.tel}
              </span>
              {copiedType === "phone" && (
                <span className="text-[10px] font-mono text-accent animate-pulse font-bold">
                  [COPIED!]
                </span>
              )}
            </div>
          </div>

          {/* Row 2: ADDRESS / LOCATION */}
          <div className="group/row flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-5 border-t border-border-custom gap-1 sm:gap-4">
            <span className="font-sans font-bold text-xs sm:text-sm md:text-base tracking-widest uppercase text-muted">
              ADDRESS
            </span>
            <span className="font-mono font-medium text-xs sm:text-sm md:text-base text-foreground text-left sm:text-right tracking-tight">
              MOHALI, PUNJAB / GREATER NOIDA, INDIA
            </span>
          </div>

          {/* Row 3: MAIL */}
          <div
            onClick={() => handleCopy(contactJson.contact.email, "email")}
            className="group/row flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-5 border-t border-b border-border-custom hover:border-accent transition-colors cursor-pointer gap-1 sm:gap-4"
            title="Click to copy email address"
          >
            <span className="font-sans font-bold text-xs sm:text-sm md:text-base tracking-widest uppercase text-muted group-hover/row:text-accent transition-colors">
              MAIL
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium text-xs sm:text-sm md:text-base uppercase text-foreground group-hover/row:text-accent transition-colors">
                {contactJson.contact.email}
              </span>
              {copiedType === "email" && (
                <span className="text-[10px] font-mono text-accent animate-pulse font-bold">
                  [COPIED!]
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ─── BOTTOM ROW: SLASHED SOCIAL LINKS & COPYRIGHT ─── */}
      <div className="pt-8 sm:pt-10 border-t border-border-custom flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        
        {/* 3 Columns of Slashed Links (Matching Reference Placement) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 sm:gap-x-12 gap-y-3 font-mono text-xs sm:text-sm">
          {socialLinks.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-2.5">
              {col.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-1.5 text-foreground/85 hover:text-accent transition-colors font-medium"
                >
                  <span className="text-muted/60 group-hover/link:text-accent transition-colors">
                    /
                  </span>
                  <span className="tracking-wide group-hover/link:translate-x-0.5 transition-transform duration-150">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Copyright Mark on Bottom Right */}
        <div className="font-mono text-xs sm:text-sm text-muted tracking-wider">
          ©2026
        </div>

      </div>
    </section>
  );
}
