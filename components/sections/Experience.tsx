import workJson from "@/data/work.json";
import { renderFormattedText } from "@/utils/text";

export default function Experience() {
  return (
    <section
      id="work"
      className="scroll-mt-24 flex flex-col gap-8 fade-up-element"
    >
      <div className="border-b border-border-custom pb-4">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight">
          03 / Experience
        </h2>
      </div>

      <div className="flex flex-col gap-12 pl-4 border-l border-border-custom relative">
        {workJson.work.map((job, index) => (
          <div
            key={index}
            className="relative flex flex-col gap-3 group fade-up-item"
            style={{ transitionDelay: `${(index + 1) * 120}ms` }}
          >
            {/* Timeline node */}
            <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border border-accent bg-background transition-transform duration-300 group-hover:scale-125 group-hover:bg-accent" />

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-foreground font-serif text-lg md:text-xl">
                  {job.title}
                </h3>
                <span className="text-xs text-accent flex items-center gap-1.5">
                  @ {job.company}
                  {job.end.toLowerCase() === "present" && (
                    <span className="relative flex h-2 w-2" title="Current Position">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                    </span>
                  )}
                </span>
              </div>
              <span className="text-xs text-muted font-mono">
                {job.start} — {job.end}
              </span>
            </div>

            <div className="text-xs text-muted flex flex-wrap gap-2">
              <span className="italic border border-border-custom px-2 py-0.5 rounded-sm bg-card/50">
                {job.location}
              </span>
              {job.links?.map((link, lIdx) => (
                <a
                  key={lIdx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline flex items-center gap-1"
                >
                  [{link.type}]
                </a>
              ))}
            </div>

            <ul className="text-xs md:text-sm text-muted leading-relaxed space-y-2 pl-4 list-none mt-1">
              {job.description.map((desc, dIdx) => (
                <li key={dIdx} className="relative">
                  {renderFormattedText(desc)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
