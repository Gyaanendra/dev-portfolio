"use client";

import React, { useState, useRef, useEffect } from "react";
import { MODEL_MAPPING } from "@/app/api/chat/route";
import { getVisitorFingerprint } from "@/lib/chat/fingerprint";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "Yo, what is Gyanendra working on right now?",
  "Why should we hire him as an AI Engineer?",
  "Tell me about his Tech Lead role at DCC",
  "What hackathons has he won?",
  "How can I reach him or see his resume?",
];

const ERROR_MESSAGE =
  "API limits reached for Groq or AI bot is having some issues with LLM API.";

// Monospace-friendly lightweight markdown parser with enhanced font scaling
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-sm sm:text-[14.5px] font-mono leading-relaxed text-foreground/90">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Heading lines (### or ##)
        if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
          const headingText = trimmed.replace(/^#+\s*/, "");
          return (
            <p
              key={idx}
              className="font-bold text-accent pt-1.5 text-base sm:text-[16px] tracking-tight"
            >
              {renderInlineStyles(headingText)}
            </p>
          );
        }

        // Bullet point lines (- or * or •)
        if (/^[-*•]\s+/.test(trimmed)) {
          const itemText = trimmed.replace(/^[-*•]\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2">
              <span className="text-accent select-none mt-1 text-sm font-bold">
                •
              </span>
              <span className="flex-1 leading-relaxed">
                {renderInlineStyles(itemText)}
              </span>
            </div>
          );
        }

        // Numbered list items (1. 2.)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2">
              <span className="text-accent font-semibold select-none text-sm">
                {numMatch[1]}.
              </span>
              <span className="flex-1 leading-relaxed">
                {renderInlineStyles(numMatch[2])}
              </span>
            </div>
          );
        }

        // Normal paragraph line
        return (
          <p key={idx} className="break-words leading-relaxed">
            {renderInlineStyles(line)}
          </p>
        );
      })}
    </div>
  );
}

// Inline formatting: **bold**, `code`, [links](url), mailto:, and raw URLs
function renderInlineStyles(text: string): React.ReactNode[] {
  // Regex splitting on bold **...**, inline code `...`, markdown links [text](url), and raw URLs
  const regex = /(\*\*.*?\*\*|`.*?`|\[\s*.*?\s*\]\(.*?\)|https?:\/\/[^\s)]+)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    // Bold **text**
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Inline code `code`
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="bg-foreground/10 px-1.5 py-0.5 rounded text-accent font-mono text-xs sm:text-[13px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Markdown link [title](url) - supports https, mailto, tel
    const linkMatch = part.match(/^\[\s*(.*?)\s*\]\((.*?)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const href = linkMatch[2].trim();
      const isEmail = href.startsWith("mailto:");
      const isTel = href.startsWith("tel:");

      return (
        <a
          key={i}
          href={href}
          target={isEmail || isTel ? undefined : "_blank"}
          rel={isEmail || isTel ? undefined : "noopener noreferrer"}
          className="text-accent underline underline-offset-3 hover:opacity-80 transition-opacity font-semibold"
        >
          {label} {!isEmail && !isTel && "↗"}
        </a>
      );
    }

    // Raw URL
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-3 hover:opacity-80 transition-opacity font-semibold"
        >
          {part} ↗
        </a>
      );
    }

    return part;
  });
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("qwen-3.8");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const visitorIdRef = useRef<string>("");

  // Initialize device fingerprint in background on mount
  useEffect(() => {
    getVisitorFingerprint().then((id) => {
      visitorIdRef.current = id;
    });
  }, []);

  // Auto-scroll messages to bottom
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  // Handle form submission and streaming
  const sendMessage = React.useCallback(
    async (messageText: string) => {
      const textToSend = messageText.trim();
      if (!textToSend || isLoading) return;

      setErrorMessage(null);
      const userMsgId = `user-${Date.now()}`;
      const userMsg: Message = {
        id: userMsgId,
        role: "user",
        content: textToSend,
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);

      const assistantMsgId = `assistant-${Date.now()}`;
      const textChunks: string[] = [];

      // Abort prior stream if active
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        // Resolve visitor fingerprint if not yet cached
        let visitorId = visitorIdRef.current;
        if (!visitorId) {
          visitorId = await getVisitorFingerprint();
          visitorIdRef.current = visitorId;
        }

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-visitor-id": visitorId,
          },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            model: selectedModel,
            visitorId,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errJson = (await res.json().catch(() => null)) as {
            error?: string;
            message?: string;
          } | null;
          const errMsg =
            errJson?.error ||
            errJson?.message ||
            (res.status === 429
              ? "hire me for higher limist"
              : res.status === 403
              ? "Forbidden: cross-origin or unauthorized request."
              : ERROR_MESSAGE);
          throw new Error(errMsg);
        }

        if (!res.body) {
          throw new Error("No response body received");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        // Initialize assistant placeholder in message list
        setMessages((prev) => [
          ...prev,
          { id: assistantMsgId, role: "assistant", content: "" },
        ]);

        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: !done });
            textChunks.push(chunk);
            const currentFullText = textChunks.join("");
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: currentFullText }
                  : msg
              )
            );
          }
        }

        // If finished without any content, show error fallback
        const finalText = textChunks.join("").trim();
        if (!finalText) {
          throw new Error("Empty response received from LLM");
        }
      } catch (err: unknown) {
        const errObj = err as { name?: string; message?: string };
        if (errObj?.name === "AbortError") {
          return; // User cancelled
        }
        console.error("Chat Agent Error:", err);
        setErrorMessage(errObj?.message || ERROR_MESSAGE);
        // Remove empty assistant placeholder if failed completely
        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantMsgId || m.content.length > 0)
        );
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [isLoading, messages, selectedModel]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleClearHistory = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setErrorMessage(null);
    setIsLoading(false);
  };

  return (
    <>
      {/* ─── FLOATING LAUNCHER BUTTON ─── */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-7 md:right-7 z-50">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="group relative flex items-center gap-3 px-4.5 py-3.5 sm:px-5 sm:py-3.5 rounded-full bg-card/95 dark:bg-black/90 backdrop-blur-md border border-border-custom text-foreground shadow-2xl hover:border-accent hover:shadow-[0_0_28px_rgba(0,210,255,0.25)] transition-all duration-300 active:scale-95 font-mono cursor-pointer"
          aria-label={isOpen ? "Close AI Agent Chat" : "Open AI Agent Chat"}
        >
          {/* Pulsing Status Dot */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
          </span>

          <span className="text-xs sm:text-sm tracking-wider uppercase font-bold text-foreground group-hover:text-accent transition-colors">
            {isOpen ? "CLOSE AGENT" : "ASK AI AGENT"}
          </span>

          <span className="text-muted text-sm transition-transform duration-300 group-hover:translate-x-0.5">
            {isOpen ? "✕" : "→"}
          </span>
        </button>
      </div>

      {/* ─── EXPANDABLE CHAT MODAL (16:9 Responsive Sizing & Typography) ─── */}
      {isOpen && (
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed bottom-16 sm:bottom-20 md:bottom-24 right-3 sm:right-6 md:right-7 z-50 w-[calc(100vw-24px)] sm:w-[500px] md:w-[560px] lg:w-[620px] xl:w-[660px] h-[680px] max-h-[86vh] bg-card/95 dark:bg-[#070707]/95 backdrop-blur-2xl border border-border-custom rounded-2xl shadow-2xl flex flex-col overflow-hidden font-mono transition-all duration-300 animate-in fade-in zoom-in-95"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-border-custom bg-foreground/[0.02]">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground tracking-wider uppercase">
                  GYANENDRA // AI AGENT
                </h3>
                <p className="text-[11px] sm:text-xs text-muted tracking-tight">
                  Autonomous Portfolio Wingman • Grounded in Real Data
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  title="Clear chat history"
                  className="px-2.5 py-1 text-xs text-muted hover:text-foreground border border-border-custom rounded hover:border-accent transition-colors cursor-pointer"
                >
                  RESET
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground rounded-full hover:bg-foreground/5 transition-colors cursor-pointer text-sm"
                aria-label="Close chat window"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Container (Lenis-prevented with stopPropagation for mouse wheel) */}
          <div
            ref={messagesContainerRef}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4 sm:space-y-4.5 scroll-smooth"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "var(--border) transparent",
            }}
          >
            {/* Empty State Greeting */}
            {messages.length === 0 && (
              <div className="space-y-4 pt-1">
                <div className="p-4 sm:p-5 rounded-xl border border-border-custom bg-foreground/[0.02] text-sm sm:text-[14.5px] leading-relaxed space-y-3">
                  <div className="text-accent font-bold tracking-wider text-xs sm:text-sm uppercase flex items-center justify-between">
                    <span>&gt; YO! WELCOME //</span>
                    <span className="text-[10px] sm:text-[11px] text-muted border border-border-custom px-2 py-0.5 rounded">
                      LIVE AGENT
                    </span>
                  </div>
                  <p className="text-foreground/90 leading-relaxed">
                    Hey there! I&apos;m Gyanendra&apos;s personal AI assistant &amp; portfolio wingman. I have direct access to all his real work at Hypotenuse Analytics, DCC Tech Lead platforms, production builds, hackathon wins, and tech stack.
                  </p>
                  <p className="text-muted text-xs sm:text-[13px] leading-relaxed">
                    Hit me with any question using natural language—whether you want the deep technical breakdown, his engineering vibe, or how to get in touch!
                  </p>
                </div>

                {/* Quick Prompts */}
                <div className="space-y-2">
                  <p className="text-xs sm:text-[12px] text-muted uppercase tracking-wider pl-1 font-semibold">
                    SUGGESTED VIBE CHECKS &amp; QUERIES:
                  </p>
                  <div className="flex flex-col gap-2">
                    {STARTER_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(prompt)}
                        className="text-left text-xs sm:text-sm p-3 rounded-lg border border-border-custom bg-foreground/[0.01] hover:border-accent hover:text-accent hover:bg-accent/5 transition-all text-foreground/80 cursor-pointer flex items-center gap-2.5 leading-snug"
                      >
                        <span className="text-accent shrink-0 font-bold">&gt;</span>
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5 px-1">
                  <span className="text-[11px] sm:text-xs text-muted uppercase tracking-wider font-semibold">
                    {msg.role === "user" ? "YOU" : "AGENT"}
                  </span>
                </div>

                <div
                  className={`max-w-[90%] rounded-xl p-3.5 sm:p-4 border ${
                    msg.role === "user"
                      ? "bg-foreground/5 dark:bg-white/5 border-border-custom text-foreground"
                      : "bg-card dark:bg-[#0c0c0c] border-border-custom text-foreground shadow-sm"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="text-sm sm:text-[14.5px] leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  ) : (
                    <FormattedMessage content={msg.content} />
                  )}
                </div>
              </div>
            ))}

            {/* Loading / Searching Indicator */}
            {isLoading && (
              <div className="flex items-start flex-col">
                <div className="flex items-center gap-1.5 mb-1.5 px-1">
                  <span className="text-[11px] sm:text-xs text-muted uppercase tracking-wider font-semibold">
                    AGENT
                  </span>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl border border-border-custom bg-card dark:bg-[#0c0c0c] flex items-center gap-3">
                  <span className="flex space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.3s]" />
                  </span>
                  <span className="text-xs sm:text-sm text-muted animate-pulse font-medium">
                    Analyzing request &amp; checking portfolio archives...
                  </span>
                </div>
              </div>
            )}

            {/* Error Message / Rate Limit Fallback */}
            {errorMessage && (
              <div
                className={`p-3.5 sm:p-4 rounded-xl border ${
                  errorMessage.toLowerCase().includes("hire me") ||
                  errorMessage.toLowerCase().includes("limist") ||
                  errorMessage.toLowerCase().includes("limit")
                    ? "border-accent/40 bg-accent/5 text-foreground"
                    : "border-red-500/30 bg-red-500/10 text-red-400"
                } text-xs sm:text-sm space-y-2 font-mono`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-accent">
                    <span>[!]</span>
                    <span>
                      {errorMessage.toLowerCase().includes("hire me")
                        ? "RATE LIMIT REACHED"
                        : "SYSTEM ALERT"}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted border border-border-custom px-1.5 py-0.5 rounded">
                    HTTP 429
                  </span>
                </div>
                <p className="leading-normal font-semibold text-accent text-sm">
                  {errorMessage}
                </p>
                {errorMessage.toLowerCase().includes("hire me") && (
                  <div className="pt-1 flex flex-wrap items-center gap-2.5">
                    <a
                      href="#contact"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-accent text-background dark:text-black font-bold text-xs hover:opacity-90 transition-opacity"
                    >
                      <span>Contact Gyanendra</span>
                      <span>→</span>
                    </a>
                    <a
                      href="mailto:contact@gyanendra.vihar.in"
                      className="text-xs text-muted hover:text-foreground underline underline-offset-2 transition-colors"
                    >
                      contact@gyanendra.vihar.in
                    </a>
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Model Selector & Input Footer */}
          <div className="p-3.5 sm:p-4 border-t border-border-custom bg-foreground/[0.02] space-y-3">
            {/* Model Selector Toolbar placed near input box */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-muted text-xs uppercase tracking-wider font-semibold">
                  MODEL:
                </span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={isLoading}
                  className="bg-card dark:bg-[#111] border border-border-custom rounded-md px-3 py-1.5 text-xs sm:text-sm text-foreground focus:border-accent focus:outline-none transition-colors cursor-pointer font-mono"
                >
                  {Object.entries(MODEL_MAPPING).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label} {key === "qwen-3.8" ? "(Default)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {isLoading && (
                <button
                  onClick={() => abortControllerRef.current?.abort()}
                  className="text-xs text-red-400 hover:text-red-300 cursor-pointer font-semibold"
                >
                  [STOP GENERATION]
                </button>
              )}
            </div>

            {/* Input Box and Send Button */}
            <div className="relative flex items-end gap-2.5 bg-card dark:bg-[#0c0c0c] border border-border-custom focus-within:border-accent rounded-xl p-2.5 sm:p-3 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about skills, DCC, Hypotenuse, hackathons..."
                rows={1}
                disabled={isLoading}
                className="flex-1 max-h-32 bg-transparent resize-none text-sm sm:text-[14.5px] text-foreground placeholder:text-muted/60 focus:outline-none leading-relaxed py-1 px-1.5 font-mono"
              />

              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="px-4 py-2.5 rounded-lg bg-foreground text-background dark:bg-white dark:text-black hover:bg-accent hover:text-background font-bold text-xs sm:text-sm disabled:opacity-30 disabled:hover:bg-foreground disabled:hover:text-background transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                aria-label="Send query"
              >
                <span>SEND</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-muted px-1 font-mono">
              <span>Enter sends • Shift+Enter for new line</span>
              <span className="text-accent/80 font-semibold">
                NLP-Powered • Grounded in Truth
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
