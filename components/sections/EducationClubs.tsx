import Image from "next/image";
import dataJson from "@/data/data.json";
import clubsJson from "@/data/clubs.json";

export default function EducationClubs() {
  return (
    <section
      id="education-clubs"
      className="scroll-mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 fade-up-element"
    >
      {/* Education column */}
      <div className="flex flex-col gap-6">
        <div className="border-b border-border-custom pb-4">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
            06 / Education
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          {dataJson.education.map((edu, index) => (
            <div
              key={index}
              className="flex gap-4 items-start relative group fade-up-item"
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="w-10 h-10 border border-border-custom rounded-sm bg-card p-1.5 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                <Image
                  src={edu.logoUrl}
                  alt={edu.school}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-foreground leading-tight hover:text-accent transition-colors">
                  <a
                    href={edu.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {edu.school}
                  </a>
                </h3>
                <p className="text-xs text-muted font-mono">{edu.degree}</p>
                <p className="text-[10px] text-accent font-semibold">
                  {edu.start} — {edu.end}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clubs and Societies Column */}
      <div className="flex flex-col gap-6">
        <div className="border-b border-border-custom pb-4">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
            07 / Leadership
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          {clubsJson.map((club, index) => (
            <div
              key={index}
              className="flex gap-4 items-start group fade-up-item"
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="w-10 h-10 border border-border-custom rounded-sm bg-card p-1.5 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                <Image
                  src={club.image}
                  alt={club.organization}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex justify-between items-start flex-wrap gap-1 leading-tight">
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    {club.organization}
                  </h3>
                </div>

                <div className="space-y-2">
                  {club.post.map((p, pIdx) => (
                    <div
                      key={pIdx}
                      className="text-xs border-l-2 border-accent pl-3 py-0.5 space-y-1"
                    >
                      <div className="flex justify-between items-baseline gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-muted">
                          {p.dates}
                        </span>
                      </div>
                      <p className="text-muted leading-relaxed text-[11px]">
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>

                {club.links && club.links.length > 0 && (
                  <div className="flex gap-3 text-[10px] font-semibold pt-1">
                    {club.links.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        [{link.title}]
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
