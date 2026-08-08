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

  return (
    <section
      id="contact"
      className="scroll-mt-24 flex flex-col gap-10 relative py-16 min-h-[45vh] justify-center items-center text-center fade-up-element overflow-hidden"
    >

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl px-4">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border-custom bg-card/60 font-mono text-xs text-muted shadow-xs">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>AVAILABLE FOR AI ROLES & FREELANCE BUILDS</span>
        </div>

        {/* Headline */}
        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
          Let's build <span className="italic font-normal text-accent">something</span> together.
        </h2>

        <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-lg font-mono">
          Have an ambitious project, full-stack role, or AI agent integration?
          Or just want to chat about Python, LLMs, and servers? Drop a line below.
        </p>

        {/* Interactive Copy Buttons (1-Click Copy Email & Phone) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 font-mono">
          <button
            onClick={() =>
              handleCopy(
                contactJson.contact.social.email.url.replace("mailto:", ""),
                "email"
              )
            }
            className="group relative inline-flex items-center gap-2 border border-accent/80 bg-accent/10 text-accent font-semibold px-4 py-2.5 rounded-md hover:bg-accent hover:text-background transition-all duration-200 text-xs shadow-xs"
            title="Click to copy email address"
          >
            <span>{contactJson.contact.social.email.url.replace("mailto:", "")}</span>
            <span className="text-[10px]">
              {copiedType === "email" ? "✓ COPIED!" : "📋"}
            </span>
          </button>

          <button
            onClick={() => handleCopy(contactJson.contact.tel, "phone")}
            className="inline-flex items-center gap-2 border border-border-custom bg-card/60 text-foreground font-semibold px-4 py-2.5 rounded-md hover:border-accent hover:text-accent transition-colors duration-200 text-xs"
            title="Click to copy phone number"
          >
            <span>{contactJson.contact.tel}</span>
            <span className="text-[10px]">
              {copiedType === "phone" ? "✓ COPIED!" : "📞"}
            </span>
          </button>
        </div>

        {/* Social Link Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono mt-4">
          <a
            href={contactJson.contact.social.GitHub.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent border border-border-custom px-4 py-2 bg-card rounded-md hover:border-accent transition-all duration-200 hover:scale-105"
          >
            [github ↗]
          </a>
          <a
            href={contactJson.contact.social.LinkedIn.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent border border-border-custom px-4 py-2 bg-card rounded-md hover:border-accent transition-all duration-200 hover:scale-105"
          >
            [linkedin ↗]
          </a>
          <a
            href={contactJson.contact.social.X.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent border border-border-custom px-4 py-2 bg-card rounded-md hover:border-accent transition-all duration-200 hover:scale-105"
          >
            [x ↗]
          </a>
        </div>
      </div>
    </section>
  );
}
