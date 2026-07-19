const frontendSkills = [
  "JavaScript",
  "React",
  "React Native",
  "Next.js",
  "TailwindCSS",
  "jQuery",
  "Expo",
  "HTML5",
  "CSS3",
  "Three.js",
  "P5.js",
  "Figma",
  "Canva",
];

const pythonAIMLSkills = [
  "Python",
  "PyTorch",
  "TensorFlow",
  "scikit-learn",
  "NumPy",
  "Pandas",
  "SciPy",
  "Matplotlib",
  "Streamlit",
];

const backendDevOpsHardwareSkills = [
  "Express.js",
  "FastAPI",
  "Flask",
  "PostgreSQL",
  "Firebase",
  "Docker",
  "Git",
  "GitHub",
  "Gunicorn",
  "Postman",
  "Render",
  "Markdown",
  "Bash Script",
  "Arduino",
  "ESP32",
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="scroll-mt-24 flex flex-col gap-6 fade-up-element overflow-hidden"
    >
      <div className="border-b border-border-custom pb-4">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight">
          02 / Skills
        </h2>
      </div>

      <p className="text-xs text-muted max-w-lg mb-2 fade-up-item delay-100">
        Dynamic horizontal index of tools, packages, and frameworks. Hover to
        pause the scroll and inspect.
      </p>

      <div className="border-y border-border-custom py-6 flex flex-col gap-6 select-none bg-card/20 relative fade-up-item delay-200">
        {/* ROW 1: Frontend & App Dev */}
        <div className="relative w-full overflow-hidden py-1">
          <div className="animate-marquee flex gap-12 whitespace-nowrap">
            {/* Render items twice for seamless repeat */}
            {[...frontendSkills, ...frontendSkills, ...frontendSkills].map(
              (skill, idx) => (
                <span
                  key={idx}
                  className="text-lg md:text-2xl font-bold tracking-tight text-muted/60 hover:text-accent transition-colors duration-200 inline-block px-2 cursor-default font-serif"
                >
                  {skill}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="border-t border-border-custom/50 w-full" />

        {/* ROW 2: AI & Python */}
        <div className="relative w-full overflow-hidden py-1">
          <div className="animate-marquee-reverse flex gap-12 whitespace-nowrap">
            {[...pythonAIMLSkills, ...pythonAIMLSkills, ...pythonAIMLSkills].map(
              (skill, idx) => (
                <span
                  key={idx}
                  className="text-lg md:text-2xl font-bold tracking-tight text-muted/60 hover:text-accent transition-colors duration-200 inline-block px-2 cursor-default font-serif"
                >
                  {skill}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="border-t border-border-custom/50 w-full" />

        {/* ROW 3: Backend & Hardware */}
        <div className="relative w-full overflow-hidden py-1">
          <div className="animate-marquee flex gap-12 whitespace-nowrap">
            {[
              ...backendDevOpsHardwareSkills,
              ...backendDevOpsHardwareSkills,
              ...backendDevOpsHardwareSkills,
            ].map((skill, idx) => (
              <span
                key={idx}
                className="text-lg md:text-2xl font-bold tracking-tight text-muted/60 hover:text-accent transition-colors duration-200 inline-block px-2 cursor-default font-serif"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
