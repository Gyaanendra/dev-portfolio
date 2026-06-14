import Image from "next/image";
import funActivityJson from "@/data/fun_activity.json";

export default function Activities() {
  return (
    <section
      id="activities"
      className="scroll-mt-24 flex flex-col gap-8 fade-up-element"
    >
      <div className="border-b border-border-custom pb-4">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight">
          08 / Activities
        </h2>
      </div>

      <p className="text-xs text-muted max-w-lg">
        Glimpses of hackathons, student projects, fests, and college
        gatherings. Grayscale shifts to color on hover.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px]">
        {funActivityJson.fun.map((act, index) => {
          // Create dynamic spans for a beautiful grid variance
          let gridClasses =
            "relative overflow-hidden group border border-border-custom rounded-sm";
          if (index === 0)
            gridClasses += " col-span-2 row-span-2"; // Double card
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
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 250px"
                className="object-cover filter grayscale contrast-115 transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
              />

              {/* Subtle hover details overlaid */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 pointer-events-none">
                <h3 className="text-xs font-bold font-serif text-foreground leading-tight">
                  {act.title}
                </h3>
                <div className="flex justify-between items-center text-[9px] text-muted mt-1 font-mono">
                  <span>{act.location}</span>
                  <span>{act.dates}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
