"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLenis } from "lenis/react";

interface ChatWidgetProps {
  onOpenChat?: () => void;
  isChatOpen?: boolean;
}

export default function ChatWidget({ onOpenChat, isChatOpen = false }: ChatWidgetProps) {
  const lenis = useLenis();
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isAboveChat, setIsAboveChat] = useState(true);

  useEffect(() => {
    const chatEl = document.getElementById("agent-chat");
    if (!chatEl || !isChatOpen) {
      setIsChatVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsChatVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(chatEl);

    const checkPosition = () => {
      const rect = chatEl.getBoundingClientRect();
      setIsAboveChat(rect.top > 200);
    };

    window.addEventListener("scroll", checkPosition, { passive: true });
    checkPosition();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkPosition);
    };
  }, [isChatOpen]);

  const handleJumpToChat = useCallback(() => {
    if (onOpenChat && !isChatOpen) {
      onOpenChat();
    }

    setTimeout(() => {
      if (lenis) {
        lenis.scrollTo("#agent-chat", { offset: -96 });
      } else {
        const el = document.getElementById("agent-chat");
        el?.scrollIntoView({ behavior: "smooth" });
      }

      setTimeout(() => {
        const textarea = document.querySelector(
          "#agent-chat textarea"
        ) as HTMLTextAreaElement | null;
        textarea?.focus();
      }, 350);
    }, 100);
  }, [lenis, onOpenChat, isChatOpen]);

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-7 md:right-7 z-50 transition-all duration-300 ${
        isChatVisible && isChatOpen
          ? "opacity-0 pointer-events-none translate-y-4 scale-95"
          : "opacity-100 pointer-events-auto translate-y-0 scale-100"
      }`}
    >
      <button
        onClick={handleJumpToChat}
        className="group relative flex items-center gap-2.5 sm:gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-card/95 dark:bg-black/90 backdrop-blur-md border border-border-custom text-foreground shadow-2xl hover:border-accent hover:shadow-[0_0_24px_rgba(0,210,255,0.22)] transition-all duration-300 active:scale-95 font-mono cursor-pointer"
        aria-label="Open or Jump to AI Agent Chat"
      >
        {/* Pulsing Status Dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
        </span>

        <span className="text-xs tracking-wider uppercase font-bold text-foreground group-hover:text-accent transition-colors">
          {isChatOpen ? "JUMP TO AI AGENT" : "CHAT WITH AI AGENT"}
        </span>

        <span className="text-accent text-xs transition-transform duration-300 group-hover:-translate-y-0.5 font-bold">
          {isChatOpen ? (isAboveChat ? "↓" : "↑") : "💬"}
        </span>
      </button>
    </div>
  );
}
