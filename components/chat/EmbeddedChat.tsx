"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { getVisitorFingerprint } from "@/lib/chat/fingerprint";

interface ToolEvent {
  id: string;
  name: string;
  status: "calling" | "completed";
  args?: Record<string, unknown>;
  summary?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  model?: string;
  isFallback?: boolean;
  toolEvents?: ToolEvent[];
}

interface EmbeddedChatProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const STARTER_PROMPTS = [
  "What is Gyanendra working on?",
  "Why hire him as AI Engineer?",
  "Tell me about his DCC Tech Lead role",
  "What hackathons has he won?",
  "How can I reach him?",
];

const ERROR_MESSAGE =
  "API limits reached for Groq or AI bot is having some issues with LLM API.";

function formatToolSummary(toolName: string, result: unknown): string {
  if (!result || typeof result !== "object") return "Data retrieved successfully";

  switch (toolName) {
    case "getPersonalInfo":
      return "Retrieved bio, location, Hermes AI agent & self-hosted Linux server specs";
    case "getEducation":
      return "Retrieved education records from Bennett University & high school";
    case "getSkills": {
      const res = result as { totalSkillsCount?: number; category?: string };
      return `Loaded ${res.totalSkillsCount || "all"} skills (${res.category || "Full Stack, AI/ML & DevOps"})`;
    }
    case "getWorkExperience": {
      const res = result as { totalRoles?: number };
      return `Loaded ${res.totalRoles || 2} roles: Hypotenuse Analytics & DCC Tech Lead`;
    }
    case "getProjects": {
      const res = result as { totalProjects?: number };
      return `Retrieved ${res.totalProjects || 5} verified projects and architectures`;
    }
    case "getClubsAndLeadership": {
      return `Retrieved leadership history at DCC and ACM Student Chapter`;
    }
    case "getAchievements": {
      const res = result as { totalAchievements?: number };
      return `Retrieved ${res.totalAchievements || 6} hackathon awards and technical honors`;
    }
    case "getContactInfo":
      return "Retrieved contact endpoints, email, phone & verified social links";
    default:
      return "Portfolio database query completed";
  }
}

// Lightweight Markdown Formatter
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-[15px] font-mono leading-relaxed text-foreground/90">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
          const headingText = trimmed.replace(/^#+\s*/, "");
          return (
            <h4
              key={idx}
              className="font-bold text-foreground pt-1 text-[15px] tracking-tight"
            >
              {renderInlineStyles(headingText)}
            </h4>
          );
        }

        if (/^[-*•]\s+/.test(trimmed)) {
          const itemText = trimmed.replace(/^[-*•]\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-accent select-none mt-0.5 text-xs font-bold">•</span>
              <span className="flex-1 leading-relaxed">{renderInlineStyles(itemText)}</span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-accent font-semibold select-none text-xs">{numMatch[1]}.</span>
              <span className="flex-1 leading-relaxed">{renderInlineStyles(numMatch[2])}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="break-words leading-relaxed">
            {renderInlineStyles(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderInlineStyles(text: string): React.ReactNode[] {
  const regex = /(\*\*.*?\*\*|`.*?`|\[\s*.*?\s*\]\(.*?\)|https?:\/\/[^\s)]+)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="bg-foreground/10 px-1 py-0.5 rounded text-accent font-mono text-[11px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

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
          className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold"
        >
          {label} {!isEmail && !isTel && "↗"}
        </a>
      );
    }

    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold"
        >
          {part} ↗
        </a>
      );
    }

    return part;
  });
}

export default function EmbeddedChat({ isOpen = false, onClose }: EmbeddedChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-agent-msg",
      role: "assistant",
      content:
        "Hello! I'm Gyanendra's autonomous AI wingman. Ask me anything about his technical stack, engineering roles, hackathon wins, or how to collaborate.",
      timestamp: "Just now",
      model: "Qwen 3.8 27B",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeModel, setActiveModel] = useState<string>("Qwen 3.8 27B");
  const [isFallbackActive, setIsFallbackActive] = useState<boolean>(false);
  const [activeSseStatus, setActiveSseStatus] = useState<string | null>(null);
  const [activeToolRunning, setActiveToolRunning] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({});

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const visitorIdRef = useRef<string>("");

  useEffect(() => {
    getVisitorFingerprint().then((id) => {
      visitorIdRef.current = id;
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when panel opens
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, isLoading, activeToolRunning, scrollToBottom]);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleToolExpanded = (msgId: string) => {
    setExpandedTools((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const sendMessage = useCallback(
    async (messageText: string) => {
      const textToSend = messageText.trim();
      if (!textToSend || isLoading) return;

      setErrorMessage(null);
      const userMsgId = `user-${Date.now()}`;
      const userMsg: Message = {
        id: userMsgId,
        role: "user",
        content: textToSend,
        timestamp: "Just now",
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);
      setActiveSseStatus("Connecting to model pipeline...");
      setActiveToolRunning(null);

      const assistantMsgId = `assistant-${Date.now()}`;
      let assistantText = "";
      const toolEventsAccumulator: ToolEvent[] = [];
      let currentModel = activeModel;
      let currentIsFallback = isFallbackActive;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        let visitorId = visitorIdRef.current;
        if (!visitorId) {
          visitorId = await getVisitorFingerprint();
          visitorIdRef.current = visitorId;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: "assistant",
            content: "",
            timestamp: "Just now",
            model: currentModel,
            isFallback: currentIsFallback,
            toolEvents: [],
          },
        ]);

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
              ? "hire me for higher limits"
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
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;

            const jsonStr = trimmed.replace(/^data:\s*/, "");
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);

              switch (event.type) {
                case "model": {
                  currentModel = event.label || "Qwen 3.8 27B";
                  currentIsFallback = Boolean(event.isFallback);
                  setActiveModel(currentModel);
                  setIsFallbackActive(currentIsFallback);
                  setActiveSseStatus(
                    currentIsFallback
                      ? `Failover active: ${currentModel}`
                      : `Active model: ${currentModel}`
                  );
                  break;
                }

                case "fallback-notice": {
                  setActiveSseStatus(
                    `Failover: ${event.failedModel} -> ${event.nextModel}`
                  );
                  break;
                }

                case "tool-call": {
                  setActiveToolRunning(event.toolName);
                  setActiveSseStatus(`Calling tool: ${event.toolName}()`);
                  toolEventsAccumulator.push({
                    id: event.toolCallId || `tool-${Date.now()}`,
                    name: event.toolName,
                    status: "calling",
                    args: event.args,
                  });
                  break;
                }

                case "tool-result": {
                  setActiveToolRunning(null);
                  setActiveSseStatus(`Tool complete: ${event.toolName}`);
                  const existingIdx = toolEventsAccumulator.findIndex(
                    (t) => t.id === event.toolCallId || t.name === event.toolName
                  );
                  const summary = formatToolSummary(event.toolName, event.result);
                  if (existingIdx !== -1) {
                    toolEventsAccumulator[existingIdx].status = "completed";
                    toolEventsAccumulator[existingIdx].summary = summary;
                  } else {
                    toolEventsAccumulator.push({
                      id: event.toolCallId || `tool-${Date.now()}`,
                      name: event.toolName,
                      status: "completed",
                      summary,
                    });
                  }
                  break;
                }

                case "text-delta": {
                  assistantText += event.text;
                  setActiveSseStatus(null);
                  break;
                }

                case "finish": {
                  setActiveSseStatus(null);
                  setActiveToolRunning(null);
                  break;
                }

                case "error": {
                  throw new Error(event.message || ERROR_MESSAGE);
                }
              }

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? {
                        ...msg,
                        content: assistantText,
                        model: currentModel,
                        isFallback: currentIsFallback,
                        toolEvents: [...toolEventsAccumulator],
                      }
                    : msg
                )
              );
            } catch (jsonErr) {
              if ((jsonErr as Error)?.message?.includes("hire me")) {
                throw jsonErr;
              }
            }
          }
        }

        if (!assistantText && toolEventsAccumulator.length === 0) {
          // Graceful fallback: inject a helpful inline message instead of a red error banner
          const fallbackText =
            "I wasn't able to generate a response for that — the query may be outside my scope or the model hit a content boundary.\n\n" +
            "I'm wired up to **8 portfolio data sources** covering everything about Gyanendra. " +
            "Try rephrasing your question or ask about his skills, projects, experience, or how to reach him.";

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: fallbackText, model: currentModel }
                : msg
            )
          );
          return;
        }
      } catch (err: unknown) {
        const errObj = err as { name?: string; message?: string };
        if (errObj?.name === "AbortError") return;

        console.error("Chat Agent Error:", err);
        setErrorMessage(errObj?.message || ERROR_MESSAGE);
        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantMsgId || m.content.length > 0)
        );
      } finally {
        setIsLoading(false);
        setActiveToolRunning(null);
        setActiveSseStatus(null);
        abortControllerRef.current = null;
      }
    },
    [activeModel, isFallbackActive, isLoading, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleClearChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([
      {
        id: "initial-agent-msg",
        role: "assistant",
        content: "Session cleared. How can I help you?",
        timestamp: "Just now",
        model: activeModel,
      },
    ]);
    setErrorMessage(null);
    setIsLoading(false);
    setActiveToolRunning(null);
    setActiveSseStatus(null);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-[998] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-from-right chat panel */}
      <div
        id="agent-chat"
        role="dialog"
        aria-modal="true"
        aria-label="AI Chat with Gyanendra"
        className={`fixed top-0 right-0 bottom-0 z-[999] flex flex-col w-full sm:w-[420px] md:w-[460px] bg-background border-l border-border-custom shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] font-mono ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── HEADER BAR ── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-custom bg-background/95 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Agent Avatar */}
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#00D2FF] via-[#0080FF] to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,210,255,0.35)] ring-1 ring-accent/40">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4" /><path d="m4.93 4.93 2.83 2.83" /><path d="M2 12h4" />
                <path d="m4.93 19.07 2.83-2.83" /><path d="M12 22v-4" />
                <path d="m19.07 19.07-2.83-2.83" /><path d="M22 12h-4" />
                <path d="m19.07 4.93-2.83 2.83" /><circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 dark:bg-[#00D2FF] border-2 border-background ring-1 ring-accent animate-pulse" />
            </div>

            <div>
              <p className="text-sm font-bold text-foreground tracking-tight leading-none">Gyanendra AI</p>
              <p className="text-[11px] text-muted mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
                <span>{activeModel}{isFallbackActive && " (Failover)"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Clear button */}
            <button
              onClick={handleClearChat}
              title="Clear conversation"
              className="w-7 h-7 rounded-full border border-border-custom hover:border-accent hover:text-accent flex items-center justify-center text-muted transition-colors cursor-pointer"
              aria-label="Clear chat"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              title="Close chat"
              className="w-7 h-7 rounded-full border border-border-custom hover:border-accent hover:text-accent flex items-center justify-center text-muted transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── STARTER PROMPTS ── */}
        <div className="px-3 py-2 border-b border-border-custom/50 bg-foreground/[0.015] flex items-center gap-2 overflow-x-auto shrink-0"
          style={{ scrollbarWidth: "none" }}
        >
          <span className="text-xs text-muted uppercase tracking-widest font-bold shrink-0">Ask:</span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {STARTER_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full border border-border-custom bg-card/50 hover:border-accent hover:text-accent transition-colors text-foreground/75 cursor-pointer text-xs disabled:opacity-40 shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* ── MESSAGE THREAD ── */}
        <div
          ref={messagesContainerRef}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto p-4 space-y-5 overscroll-contain"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border) transparent",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              {msg.role === "user" ? (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-neutral-800 via-neutral-700 to-neutral-600 dark:from-neutral-200 dark:via-neutral-100 dark:to-white text-white dark:text-black flex items-center justify-center shrink-0 shadow-sm ring-1 ring-foreground/20">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              ) : (
                <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-[#00D2FF] via-[#0080FF] to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,210,255,0.35)] ring-1 ring-accent/40">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4" /><path d="m4.93 4.93 2.83 2.83" /><path d="M2 12h4" />
                    <path d="m4.93 19.07 2.83-2.83" /><path d="M12 22v-4" />
                    <path d="m19.07 19.07-2.83-2.83" /><path d="M22 12h-4" />
                    <path d="m19.07 4.93-2.83 2.83" /><circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </div>
              )}

              {/* Message bubble */}
              <div className={`flex-1 space-y-1.5 ${msg.role === "user" ? "flex flex-col items-end" : ""}`}>
                {/* Tool events */}
                {msg.role === "assistant" && msg.toolEvents && msg.toolEvents.length > 0 && (
                  <div className="mb-1.5">
                    <button
                      onClick={() => toggleToolExpanded(msg.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border-custom bg-foreground/[0.03] hover:border-accent/60 text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                      <span className="text-accent font-bold">⚙</span>
                      <span>Used {msg.toolEvents.length} tool{msg.toolEvents.length > 1 ? "s" : ""}</span>
                      <span className="text-[10px] text-muted">{expandedTools[msg.id] ? "▲" : "▼"}</span>
                    </button>

                    {expandedTools[msg.id] && (
                      <div className="mt-1.5 p-2.5 rounded-lg border border-border-custom bg-card/40 space-y-1.5 text-xs">
                        <div className="text-[10px] text-muted uppercase font-bold tracking-wider border-b border-border-custom pb-1 flex justify-between">
                          <span>SSE TOOL EXECUTION TRACE</span>
                          <span className="text-accent">{msg.model || activeModel}</span>
                        </div>
                        {msg.toolEvents.map((toolEv) => (
                          <div key={toolEv.id} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-accent font-bold mt-0.5">✓</span>
                            <div>
                              <span className="font-semibold text-foreground">{toolEv.name}()</span>
                              {toolEv.summary && (
                                <p className="text-muted text-[10px] mt-0.5">{toolEv.summary}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Message content */}
                {msg.role === "user" ? (
                  <div className="inline-block max-w-[85%] bg-foreground/[0.06] dark:bg-foreground/[0.08] border border-border-custom rounded-2xl rounded-tr-sm px-3.5 py-2.5">
                    <p className="text-[15px] text-foreground font-mono leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                ) : (
                  <div className="max-w-full">
                    <FormattedMessage content={msg.content} />
                  </div>
                )}

                {/* Assistant actions */}
                {msg.role === "assistant" && msg.content && (
                  <div className="flex items-center gap-2 pt-0.5 text-muted">
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="hover:text-foreground transition-colors cursor-pointer p-0.5 rounded"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <span className="text-accent text-xs font-bold">✓ Copied</span>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Active tool running */}
          {isLoading && activeToolRunning && (
            <div className="flex items-start gap-2.5">
              <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-[#00D2FF] via-[#0080FF] to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,210,255,0.35)] ring-1 ring-accent/40">
                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
              <div className="flex-1 pt-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-accent/40 bg-accent/5 text-xs text-foreground font-medium">
                  <span className="text-accent animate-spin">⚙</span>
                  <span>Calling {activeToolRunning}()</span>
                  <span className="text-muted animate-pulse">Querying portfolio...</span>
                </div>
              </div>
            </div>
          )}

          {/* SSE Status */}
          {isLoading && !activeToolRunning && (
            <div className="flex items-start gap-2.5">
              <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-[#00D2FF] via-[#0080FF] to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,210,255,0.35)] ring-1 ring-accent/40">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
              <div className="flex-1 pt-1.5 flex items-center gap-1.5">
                <span className="text-xs text-muted font-medium">
                  {activeSseStatus || "Gyanendra AI is thinking..."}
                </span>
                <span className="flex space-x-0.5">
                  <span className="w-1 h-1 bg-accent rounded-full animate-bounce" />
                  <span className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:0.3s]" />
                </span>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl border border-accent/40 bg-accent/5 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-accent">
                <span>SYSTEM NOTICE</span>
                <span className="text-[10px] text-muted">HTTP 429</span>
              </div>
              <p className="font-semibold text-accent">{errorMessage}</p>
              {errorMessage.toLowerCase().includes("hire me") && (
                <div className="pt-1 flex items-center gap-2">
                  <a
                    href="#contact"
                    onClick={onClose}
                    className="px-2.5 py-1 rounded bg-accent text-background dark:text-black font-bold text-[10px] hover:opacity-90 transition-opacity"
                  >
                    Contact Gyanendra →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── INPUT AREA ── */}
        <div className="p-3 border-t border-border-custom bg-background/95 shrink-0">
          <div className="rounded-xl border border-border-custom bg-card/90 dark:bg-[#0f0f0f] shadow-sm focus-within:border-accent/70 transition-all p-2.5 space-y-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Gyanendra..."
              rows={1}
              disabled={isLoading}
              className="w-full max-h-28 bg-transparent resize-none text-[15px] text-foreground placeholder:text-muted/55 focus:outline-none leading-relaxed py-0.5 px-1 font-mono"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted/60 px-1">Enter to send · Shift+Enter for newline</span>

              <div className="flex items-center gap-1.5">
                {isLoading ? (
                  <button
                    onClick={() => abortControllerRef.current?.abort()}
                    className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent text-background dark:text-black hover:opacity-95 font-semibold text-sm disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed shadow-sm"
                    aria-label="Send message"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
                    </svg>
                    <span>Send</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-muted/50 pt-2">
            Grounded in Gyanendra&apos;s real portfolio data
          </p>
        </div>
      </div>
    </>
  );
}
