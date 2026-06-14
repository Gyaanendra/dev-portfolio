import contactJson from "@/data/contact.json";

interface CodingProfilesProps {
  theme: "light" | "dark";
}

export default function CodingProfiles({ theme }: CodingProfilesProps) {
  return (
    <section
      id="profiles"
      className="scroll-mt-24 flex flex-col gap-8 fade-up-element"
    >
      <div className="border-b border-border-custom pb-4">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight font-normal">
          04 / Code Profiles
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 bg-card border border-border-custom p-6 rounded-sm glow-card">
        <div className="flex justify-between items-start flex-wrap gap-4 border-b border-border-custom pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              GitHub Contributions
            </h3>
            <p className="text-xs text-muted mt-1">
              My open-source and active contributions tracker.
            </p>
          </div>
          <a
            href={contactJson.contact.social.GitHub.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent border border-accent px-3 py-1 rounded-sm hover:bg-accent hover:text-background transition-all"
          >
            Follow @Gyaanendra
          </a>
        </div>

        {/* Contribution chart */}
        <div className="w-full py-4 flex items-center justify-center overflow-x-auto no-scrollbar">
          {/* Dynamic SVG color maps with theme */}
          <div className="min-w-[720px] w-full max-w-4xl opacity-90 hover:opacity-100 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://ghchart.rshah.org/${theme === "dark" ? "00ff88" : "00a65a"}/Gyaanendra`}
              alt="Gyanendra Prakash's GitHub Contribution Calendar"
              className="w-full dark:invert-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
