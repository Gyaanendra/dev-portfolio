import Image from "next/image";
import dataJson from "@/data/data.json";

export default function Education() {
  return (
    <section
      id="education"
      className="scroll-mt-24 flex flex-col gap-8 fade-up-element w-full"
    >
      {/* ─── SECTION 06: Education ─── */}
      <div className="border-b border-border-custom pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground">
          06 / Education
        </h2>
        <span className="text-xs font-mono text-muted">
          ✦ Academic Journey &amp; Milestones
        </span>
      </div>

      {/* Spacious Vertical Timeline Spine */}
      <div className="relative border-l-2 border-border-custom ml-4 pl-8 flex flex-col gap-10 py-2">
        {dataJson.education.map((edu, index) => (
          <div
            key={index}
            className="relative group fade-up-item"
            style={{ transitionDelay: `${(index + 1) * 100}ms` }}
          >
            {/* Timeline Node Dot */}
            <div className="absolute -left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-background border-2 border-accent group-hover:bg-accent group-hover:scale-125 transition-all duration-300 shadow-xs" />

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* School Logo Box */}
                <div className="w-12 h-12 border border-border-custom rounded-lg bg-card p-2 shrink-0 relative overflow-hidden flex items-center justify-center shadow-xs group-hover:border-accent/50 transition-colors">
                  <Image
                    src={edu.logoUrl}
                    alt={edu.school}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>

                <div className="space-y-1 font-mono">
                  <h3 className="font-serif text-xl font-bold text-foreground leading-tight hover:text-accent transition-colors">
                    <a
                      href={edu.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5"
                    >
                      <span>{edu.school}</span>
                      <span className="text-xs text-muted group-hover:text-accent transition-colors">↗</span>
                    </a>
                  </h3>
                  <p className="text-sm text-muted">{edu.degree}</p>
                </div>
              </div>

              <div className="sm:text-right shrink-0 font-mono">
                <span className="text-xs font-bold text-accent border border-accent/40 bg-accent/5 px-2.5 py-1 rounded-sm">
                  {edu.start} — {edu.end}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
