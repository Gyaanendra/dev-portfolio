import dataJson from "@/data/data.json";
import { renderFormattedText } from "@/utils/text";

export default function About() {
  return (
    <section
      id="about"
      className="scroll-mt-24 flex flex-col gap-8 fade-up-element"
    >
      <div className="border-b border-border-custom pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight">
          01 / About
        </h2>
        <span className="text-xs text-muted font-mono">
          {dataJson.location}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 text-sm md:text-base leading-relaxed text-muted space-y-4 font-mono fade-up-item delay-100">
          <p>{renderFormattedText(dataJson.summary)}</p>
        </div>

        <div className="flex flex-col gap-4 bg-card border border-border-custom p-6 rounded-sm shadow-sm fade-up-item delay-200">
          <h3 className="text-xs uppercase font-bold tracking-widest text-foreground border-b border-border-custom pb-2">
            Resume
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Take a look at my structured engineering history and credentials.
          </p>
          <a
            href="/resume.pdf"
            download="Gyanendra_Prakash_Resume.pdf"
            className="inline-flex items-center justify-center gap-2 border border-accent text-accent font-semibold px-4 py-2 hover:bg-accent hover:text-background transition-colors duration-300 text-xs rounded-sm mt-2 font-mono"
          >
            Download Resume <span className="text-[10px]">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
