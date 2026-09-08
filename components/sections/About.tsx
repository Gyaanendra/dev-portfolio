import Image from "next/image";
import dataJson from "@/data/data.json";

interface AboutProps {
  isChatOpen?: boolean;
  onToggleChat?: () => void;
}

export default function About({ isChatOpen = false, onToggleChat }: AboutProps) {
  return (
    <section
      id="about"
      className="scroll-mt-28 flex flex-col gap-8 fade-up-element pt-8 pb-6 sm:py-6"
    >
      {/* Header */}
      <div className="border-b border-border-custom pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div className="flex items-baseline gap-2">
          <h2 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground">
            01 / About
          </h2>
        </div>
        <span className="text-xs font-mono text-muted">
          ( The developer behind the pixels &amp; models )
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Content Area (Quote + Narrative + Resume + 3-Column Grid) */}
        <div className="lg:col-span-7 flex flex-col gap-6 pt-2 sm:pt-0 order-2 lg:order-1">
          {/* Intro Narrative Headline */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-serif leading-relaxed text-foreground">
            Architecting <span className="italic text-accent">autonomous AI systems</span>, scalable full-stack applications, and storytelling through code.
          </h3>

          {/* Status Pill & Modern Narrative Summary */}
          <div className="flex flex-col gap-4">
            <div className="text-sm sm:text-base md:text-[17px] leading-[1.8] text-foreground/85 space-y-4 font-mono">
              <p>
                My name is <strong className="text-foreground font-bold">Gyanendra Prakash</strong>. My core strengths are <span className="text-foreground font-bold border-b-2 border-accent">AI Engineering</span>, <strong className="text-foreground font-bold">Full Stack Development</strong>, and <strong className="text-foreground font-bold">Intelligent Agents</strong>. Currently a <span className="text-accent font-bold">3rd-year B.Tech Computer Science &amp; Engineering</span> student at <strong className="text-foreground font-bold">Bennett University</strong>, I love building autonomous systems and contributing my technical skills to innovative, high-impact projects.
              </p>
              <p>
                A <span className="text-accent font-bold">3x hackathon winner</span> and active builder, I self-host custom cloud AI infrastructure—including a cloud-based <strong className="text-foreground font-bold">Hermes AI agent</strong>—and converted a repurposed desktop PC into my own 24/7 Linux home server. When I&apos;m not pushing code, I&apos;m gaming, exploring cinema, or trying new recipes in the kitchen.
              </p>
            </div>
          </div>

          {/* 3-Column Subgrid (Responsive Stacking) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5 border-t border-border-custom font-mono">
            <div className="border-b sm:border-b-0 border-border-custom/50 pb-4 sm:pb-0">
              <h4 className="text-xs uppercase font-bold tracking-widest text-accent mb-2">
                01 / AI &amp; LLMS
              </h4>
              <ul className="text-xs text-muted space-y-1">
                <li>AI Agents &amp; Fine-Tuning</li>
                <li>RAG &amp; Vector Search</li>
                <li>Prompt Craft &amp; Ollama</li>
                <li>PyTorch &amp; HuggingFace</li>
              </ul>
            </div>

            <div className="border-b sm:border-b-0 border-border-custom/50 pb-4 sm:pb-0">
              <h4 className="text-xs uppercase font-bold tracking-widest text-accent mb-2">
                02 / FULL STACK
              </h4>
              <ul className="text-xs text-muted space-y-1">
                <li>Next.js &amp; React</li>
                <li>FastAPI &amp; Python</li>
                <li>PostgreSQL &amp; Firebase</li>
                <li>TailwindCSS &amp; GSAP</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold tracking-widest text-accent mb-2">
                03 / BUILDER
              </h4>
              <ul className="text-xs text-muted space-y-1">
                <li>3x Hackathon Winner</li>
                <li>Self-Hosted Linux Server</li>
                <li>Docker &amp; Cloud Deployment</li>
                <li>Agentic Workflows</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Visual Area (Main B&W Photo + Action Buttons) */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end pt-6 sm:pt-4 order-1 lg:order-2">
          <div className="relative group w-full max-w-[340px] sm:max-w-[380px] flex flex-col gap-3">
            {/* Main Photo Card */}
            <div className="relative rounded-xl overflow-hidden border border-border-custom bg-card shadow-md">
              <div className="relative aspect-[4/4.8] w-full">
                <Image
                  src={dataJson.avatarUrl || "/images/me1.jpg"}
                  alt="Gyanendra Prakash"
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                  priority
                />
              </div>

              {/* Bottom Sticker Pill */}
              <div className="absolute bottom-3 left-3 z-10 bg-card/90 backdrop-blur-md border border-border-custom px-3 py-1 rounded-full shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-wider uppercase text-foreground">
                  YES, THAT&apos;S ME ⚡
                </span>
              </div>
            </div>

            {/* Action Buttons Stack (Resume + Open/Close AI Chat) */}
            <div className="flex flex-col gap-3 w-full font-mono">
              {/* Resume Button */}
              <a
                href="/resume.pdf"
                download="Gyanendra_Prakash_Resume.pdf"
                className="w-full justify-center inline-flex items-center gap-2.5 border border-accent text-accent text-sm font-bold px-5 py-3.5 rounded-sm bg-card/40 hover:bg-accent hover:text-background transition-colors duration-200 shadow-sm tracking-wide"
              >
                <span>Download Engineering Resume</span>
                <span className="text-base leading-none">↓</span>
              </a>

              {/* Toggle AI Agent Chat Button */}
              {onToggleChat && (
                <button
                  type="button"
                  onClick={onToggleChat}
                  className={`w-full justify-center inline-flex items-center gap-3 border text-sm font-bold px-5 py-3.5 rounded-sm transition-all duration-200 shadow-sm cursor-pointer tracking-wide ${
                    isChatOpen
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border-custom hover:border-accent text-foreground hover:text-accent bg-card/60"
                  }`}
                  aria-expanded={isChatOpen}
                >
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                  </span>
                  <span>
                    {isChatOpen
                      ? "Close AI Wingman Chat ✕"
                      : "Chat with AI Wingman 💬"}
                  </span>
                  <span className="text-xs text-muted ml-auto">
                    {isChatOpen ? "▲" : "▼"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
