import Image from "next/image";
import achievementsJson from "@/data/achievements.json";

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="scroll-mt-24 flex flex-col gap-8 fade-up-element"
    >
      {/* Header */}
      <div className="border-b border-border-custom pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground">
          08 / Achievements
        </h2>
        <span className="text-xs font-mono text-muted">
          ✦ Competitive hackathon podiums, awards & engineering challenges
        </span>
      </div>

      <p className="text-xs text-muted max-w-lg font-mono">
        Podium finishes and competitive recognitions in engineering and AI hackathons.
        Grayscale shifts to full vivid color on hover.
      </p>

      {/* Grid of High-Resolution Hackathon Winner Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 auto-rows-[220px] sm:auto-rows-[260px]">
        {achievementsJson.achievements.map((act, index) => {
          return (
            <div
              key={index}
              className="relative overflow-hidden group border border-border-custom rounded-lg bg-card shadow-sm hover:shadow-md fade-up-item"
              style={{ transitionDelay: `${(index + 1) * 80}ms` }}
            >
              <Image
                src={act.image}
                alt={act.title}
                fill
                unoptimized
                priority
                className="object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
              />

              {/* Sticker badge */}
              <div className="absolute top-3 left-3 bg-accent text-background font-mono font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-sm shadow-sm z-10 select-none">
                {act.achievement ? `${act.achievement.toUpperCase()} ⚡` : "PODIUM FINISH ⚡"}
              </div>

              {/* Hover details overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                {act.achievement && (
                  <span className="text-[11px] font-mono text-accent font-semibold tracking-wider uppercase mb-0.5">
                    {act.achievement}
                  </span>
                )}
                <h3 className="text-sm font-bold font-serif text-white leading-tight">
                  {act.title}
                </h3>
                <div className="flex justify-between items-center text-[10px] text-neutral-300 mt-1 font-mono">
                  <span>{act.location}</span>
                  {act.dates && <span>{act.dates}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
