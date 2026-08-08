import Image from "next/image";
import funActivityJson from "@/data/fun_activity.json";

export default function Activities() {
  return (
    <section
      id="activities"
      className="scroll-mt-24 flex flex-col gap-8 fade-up-element"
    >
      {/* Header */}
      <div className="border-b border-border-custom pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground">
          08 / Activities
        </h2>
        <span className="text-xs font-mono text-muted">
          ✦ High-resolution glimpses of hackathons, student projects & campus life
        </span>
      </div>

      <p className="text-xs text-muted max-w-lg font-mono">
        Glimpses of hackathons, student projects, fests, and college gatherings.
        Grayscale shifts to full vivid color on hover.
      </p>

      {/* Grid of High-Resolution Activity Photos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] sm:auto-rows-[220px]">
        {funActivityJson.fun.map((act, index) => {
          let gridClasses =
            "relative overflow-hidden group border border-border-custom rounded-lg bg-card shadow-sm hover:shadow-md";
          if (index === 0) gridClasses += " col-span-2 row-span-2";
          else if (index === 1) gridClasses += " row-span-2";
          else if (index === 4) gridClasses += " col-span-2";
          else if (index === 8) gridClasses += " row-span-2";

          return (
            <div
              key={index}
              className={`${gridClasses} fade-up-item`}
              style={{ transitionDelay: `${(index + 1) * 60}ms` }}
            >
              <Image
                src={act.image}
                alt={act.title}
                fill
                unoptimized
                priority={index < 4}
                className="object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
              />

              {/* Sticker tags */}
              {index === 0 && (
                <div className="absolute top-3 left-3 bg-accent text-background font-mono font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-sm shadow-sm z-10 select-none">
                  CAMPUS LIFE ✦
                </div>
              )}
              {index === 1 && (
                <div className="absolute top-3 left-3 bg-accent text-background font-mono font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-sm shadow-sm z-10 select-none">
                  HACKATHON WINNER ⚡
                </div>
              )}

              {/* Hover details overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
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
