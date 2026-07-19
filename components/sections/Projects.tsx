import projectsJson from "@/data/projects.json";

export default function Projects() {
  return (
    <section
      id="projects"
      className="scroll-mt-24 flex flex-col gap-8 fade-up-element"
    >
      <div className="border-b border-border-custom pb-4">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight">
          05 / Projects
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-border-custom">
        {projectsJson.projects.map((project, index) => {
          const numStr = String(index + 1).padStart(2, "0");

          return (
            <div
              key={index}
              className="relative flex flex-col justify-between p-8 md:p-10 group transition-all duration-300 border-b border-border-custom md:[&:nth-child(even)]:border-l border-border-custom overflow-hidden fade-up-item"
              style={{ transitionDelay: `${(index + 1) * 120}ms` }}
            >
              {/* Sweep-in top accent border on hover */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-20" />

              {/* Header: Project Index and Arrow */}
              <div className="flex justify-between items-center z-10">
                <span className="text-muted/40 font-mono text-xs select-none">
                  {numStr} / PROJECT
                </span>
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted/30 group-hover:text-accent transition-colors duration-300 font-mono text-base hover:scale-110 transform"
                    title="View project source"
                  >
                    ↗
                  </a>
                ) : (
                  <span className="text-muted/25 font-mono text-base">↗</span>
                )}
              </div>

              {/* Body: Title, Description, Screenshot, Technologies */}
              <div className="flex-1 flex flex-col justify-between gap-4 mt-6 z-10">
                <div className="space-y-4">
                  <h3 className="font-serif text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
                    {project.title}
                  </h3>

                  <p className="text-xs md:text-sm text-muted leading-relaxed font-mono min-h-[48px]">
                    {project.description}
                  </p>

                  {/* Project Main Image Screenshot with scroll parallax window */}
                  {project.image && project.title !== "Coming Soon" && (
                    <div className="w-full h-48 flex items-center justify-center mt-4 overflow-hidden border border-border-custom rounded-sm bg-card/10 parallax-container">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-[120%] object-contain transition-all duration-500 ease-out filter grayscale contrast-115 group-hover:grayscale-0 group-hover:scale-105"
                        style={{
                          transform:
                            "translateY(calc((var(--scroll-ratio, 0.5) - 0.5) * -35px))",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  {/* Technologies list */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] text-muted/80 font-mono uppercase px-2 py-0.5 border border-border-custom rounded-sm bg-card/20 select-none group-hover:border-accent/40 group-hover:text-foreground transition-colors duration-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links list */}
                  {project.links && project.links.length > 0 && (
                    <div className="flex gap-4 mt-4 text-xs font-semibold font-mono">
                      {project.links.map((link, lIdx) => (
                        <a
                          key={lIdx}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline flex items-center gap-1"
                        >
                          [{link.type.toLowerCase()}]
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
