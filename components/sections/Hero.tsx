import Image from "next/image";
import dataJson from "@/data/data.json";

type BadgeDef = {
  label: string;
  className: string;
  dur: string;
  del: string;
  icon: React.ReactNode;
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
  Terminal: (
    <SvgIcon>
      <path d="M3 5l5 5-5 5" />
      <line x1="11" y1="16" x2="17" y2="16" />
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
  PyTorch: (
    <SvgIcon>
      <polygon points="10,2 3,16 17,16" />
      <rect x="8.5" y="16" width="3" height="3" rx="0.5" />
    </SvgIcon>
  ),
  Threejs: (
    <SvgIcon>
      <polygon points="10,2 18,15 2,15" />
      <line x1="10" y1="2" x2="10" y2="15" />
      <line x1="3" y1="11" x2="17" y2="11" />
    </SvgIcon>
  ),
  TailwindCSS: (
    <SvgIcon>
      <path d="M4 13c0-3 1.5-5 4-6C6 8 5.5 10 6 12c.8 2 2.5 3 5 3 0 0-3 1-5 3-2 2-2 4 0 6 2-2 1.5-4 3-5 1.5-1 3.5-1 5-1" />
    </SvgIcon>
  ),
  Firebase: (
    <SvgIcon viewBox="0 0 20 20">
      <path d="M4 17l3-14 4 7-2 3" />
      <path d="M11 10l3-6 2 10-6 2" />
      <path d="M7 17l4-8 3 6" />
    </SvgIcon>
  ),
} satisfies Record<string, React.ReactNode>;

const badges: BadgeDef[] = [
  { label: "React",       className: "top-[2%] left-[2%] 2xl:left-[6%] hidden md:block",                               dur: "4.7s", del: "0.15s", icon: icons.React },
  { label: "Next.js",     className: "top-[6%] left-[16%] hidden lg:block",                                             dur: "5.1s", del: "0.50s", icon: icons.Nextjs },
  { label: "Python",      className: "top-[1%] right-[3%] 2xl:right-[7%] hidden md:block",                              dur: "5.3s", del: "0.70s", icon: icons.Python },
  { label: "TypeScript",  className: "top-[7%] right-[16%] hidden lg:block",                                            dur: "4.5s", del: "0.25s", icon: icons.TypeScript },
  { label: "Git",         className: "top-[24%] left-[1%] 2xl:left-[4%] hidden md:block",                               dur: "4.2s", del: "1.10s", icon: icons.Git },
  { label: "Docker",      className: "top-[27%] right-[1%] 2xl:right-[5%] hidden lg:block",                             dur: "5.8s", del: "0.05s", icon: icons.Docker },
  { label: "LLMs",        className: "top-[42%] left-[1%] 2xl:left-[3%] hidden md:block",                               dur: "6.1s", del: "0.55s", icon: icons.LLMs },
  { label: "PostgreSQL",  className: "top-[46%] right-[1%] 2xl:right-[4%] hidden md:block",                             dur: "4.9s", del: "1.35s", icon: icons.PostgreSQL },
  { label: "Three.js",    className: "bottom-[26%] left-[2%] hidden lg:block",                                          dur: "5.5s", del: "0.40s", icon: icons.Threejs },
  { label: "PyTorch",     className: "bottom-[20%] right-[3%] hidden lg:block",                                         dur: "4.3s", del: "0.95s", icon: icons.PyTorch },
  { label: "TailwindCSS", className: "bottom-[10%] left-[7%] hidden xl:block",                                          dur: "6.3s", del: "0.18s", icon: icons.TailwindCSS },
  { label: "Firebase",    className: "bottom-[6%] right-[7%] hidden xl:block",                                          dur: "5.0s", del: "1.45s", icon: icons.Firebase },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex items-center justify-center min-h-[90vh] pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden"
    >
      {/* ─── Subtle ambient glow behind content ─── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div
          className="rounded-full blur-3xl"
          style={{
            width: "clamp(300px, 60vw, 700px)",
            height: "clamp(300px, 60vw, 700px)",
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            opacity: 0.06,
            transform: "translateY(-5%)",
          }}
        />
      </div>

      {/* ─── Floating tech badges ─── */}
      <div className="absolute inset-0 pointer-events-none select-none z-10" aria-hidden="true">
        {badges.map((b) => (
          <span
            key={b.label}
            className={`absolute ${b.className}`}
            style={{
              animation: `hero-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) ${b.del} backwards, badge-float ${b.dur} ease-in-out ${b.del} infinite`,
            }}
          >
            <span className="badge-pill">
              {b.icon}
              {b.label}
            </span>
          </span>
        ))}
      </div>

      {/* ─── Centered content column ─── */}
      <div className="relative z-20 flex flex-col items-center text-center gap-7 md:gap-10 px-5 max-w-4xl mx-auto w-full">

        {/* ─── Photo stack ─── */}
        <div
          className="hero-fade relative flex items-center justify-center w-full mx-auto"
          style={{
            maxWidth: "clamp(260px, 48vw, 544px)",
            animation: "hero-fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0s backwards",
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{ "--card-w": "clamp(160px, 30vw, 340px)" } as React.CSSProperties}
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
                className="object-cover object-top grayscale contrast-115"
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
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* ─── Heading ─── */}
        <h1
          className="hero-fade font-serif text-foreground leading-[1.04] tracking-tight"
          style={{
            fontSize: "clamp(2.5rem, 9vw, 5.75rem)",
            animation: "hero-fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s backwards",
          }}
        >
          {"Hi, I'm"}
          <br />
          <span className="text-accent italic tracking-wide">
            Gyanendra
            <span className="inline-block animate-blink font-serif font-light text-foreground ml-1">
              _
            </span>
          </span>
        </h1>

        {/* ─── Role tagline ─── */}
        <p
          className="hero-fade font-mono text-xs md:text-sm text-accent tracking-[0.15em] uppercase font-medium -mt-2 md:-mt-3"
          style={{
            animation: "hero-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s backwards",
          }}
        >
          AI Engineer &amp; Full Stack Developer
        </p>

        {/* ─── Description ─── */}
        <p
          className="hero-fade max-w-2xl text-sm md:text-base leading-relaxed text-muted font-mono"
          style={{
            animation: "hero-fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.45s backwards",
          }}
        >
          {dataJson.description}
        </p>

        {/* ─── Mobile badge row ─── */}
        <div
          className="hero-fade flex md:hidden flex-wrap justify-center gap-2 mt-2"
          style={{
            animation: "hero-fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s backwards",
          }}
        >
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
