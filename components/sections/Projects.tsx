"use client";

import { useState } from "react";
import projectsJson from "@/data/projects.json";

export default function Projects() {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section
      id="projects"
      className="scroll-mt-24 flex flex-col gap-8 fade-up-element relative"
      onMouseMove={handleMouseMove}
    >
      {/* Section Header */}
      <div className="border-b border-border-custom pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground">
          05 / Projects
        </h2>
        <span className="text-xs font-mono text-muted">
          ✦ Hover over any project to reveal image preview
        </span>
      </div>

      {/* Floating Hover Image Preview (Motion-Designed Tilted Card anchored near title heading) */}
      {activeProject !== null && projectsJson.projects[activeProject]?.image && (
        <div
          className="hidden md:block fixed top-0 left-0 z-50 pointer-events-none w-72 lg:w-[370px] aspect-[16/10.5] rounded-xl overflow-hidden border-2 border-border-custom bg-card shadow-2xl animate-[previewPopIn_250ms_cubic-bezier(0.16,1,0.3,1)] transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${
              typeof window !== "undefined"
                ? Math.min(mousePos.x * 0.12 + 340, window.innerWidth * 0.48)
                : 380
            }px, ${mousePos.y - 130}px, 0) rotate(-4deg)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={activeProject}
            src={projectsJson.projects[activeProject].image}
            alt={projectsJson.projects[activeProject].title}
            className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 animate-[imageCrossfade_300ms_cubic-bezier(0.16,1,0.3,1)]"
          />
        </div>
      )}

      {/* Project List Rows */}
      <div className="flex flex-col border-t border-border-custom font-mono">
        {projectsJson.projects.map((project, index) => {
          const numStr = String(index + 1).padStart(2, "0");
          const isHovered = activeProject === index;

          return (
            <div
              key={index}
              onMouseEnter={() => setActiveProject(index)}
              onMouseLeave={() => setActiveProject(null)}
              className={`group relative flex flex-col md:flex-row justify-between items-start md:items-center py-7 px-4 md:px-6 border-b border-border-custom transition-all duration-300 ${
                isHovered ? "bg-card/60" : "bg-transparent"
              }`}
            >
              {/* Sweep Accent Indicator Line */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 bg-accent transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Left Column: Num + Title + Description */}
              <div className="flex flex-col gap-2 max-w-2xl">
                <div className="flex items-baseline gap-4">
                  <span className="text-xs text-accent font-bold select-none">
                    0{numStr}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
                    {project.title}
                  </h3>
                </div>

                <p className="text-xs md:text-sm text-muted leading-relaxed pl-8">
                  {project.description}
                </p>

                {/* Tech Pills */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pl-8 pt-1">
                    {project.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] text-muted/80 uppercase px-2 py-0.5 border border-border-custom rounded-sm bg-background select-none group-hover:border-accent/40 group-hover:text-foreground transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Inline Thumbnail for Mobile Devices */}
                {project.image && (
                  <div className="md:hidden w-full h-40 mt-3 rounded-md border border-border-custom overflow-hidden bg-neutral-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Right Column: Action Links & Arrow */}
              <div className="flex items-center gap-4 mt-4 md:mt-0 pl-8 md:pl-0 shrink-0">
                {project.links && project.links.length > 0 ? (
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    {project.links.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 border border-border-custom px-3 py-1.5 rounded-sm text-foreground hover:border-accent hover:text-accent transition-colors bg-card/40"
                      >
                        <span>[{link.type.toLowerCase()}]</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted/50 italic">
                    [in progress]
                  </span>
                )}

                <span className="text-lg text-muted/40 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
                  →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
