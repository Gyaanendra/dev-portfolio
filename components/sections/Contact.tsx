import contactJson from "@/data/contact.json";

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 flex flex-col gap-12 relative py-12 min-h-[40vh] justify-center items-center text-center fade-up-element overflow-hidden"
    >
      {/* Faded Background Text */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.02] dark:opacity-[0.03]">
        <span className="font-serif text-9xl sm:text-[14rem] md:text-[18rem] font-bold tracking-tighter leading-none whitespace-nowrap">
          G.Prakash
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-xl">
        <h2 className="font-serif text-5xl md:text-7xl tracking-tight text-foreground fade-up-item delay-100">
          {"Let's build together."}
        </h2>

        <p className="text-xs md:text-sm text-muted leading-relaxed px-4 fade-up-item delay-200">
          Have an interesting project, role, or idea? Or just want to talk about
          AI Agents, LLMs, and Python engineering? Shoot a line.
        </p>

        {/* Social Buttons (Bracketed mono layout) */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-mono mt-4 fade-up-item delay-300">
          <a
            href={contactJson.contact.social.email.url}
            className="hover:text-accent border border-border-custom px-4 py-2 bg-card rounded-sm hover:border-accent transition-all duration-200"
          >
            [email]
          </a>
          <a
            href={contactJson.contact.social.GitHub.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent border border-border-custom px-4 py-2 bg-card rounded-sm hover:border-accent transition-all duration-200"
          >
            [github]
          </a>
          <a
            href={contactJson.contact.social.LinkedIn.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent border border-border-custom px-4 py-2 bg-card rounded-sm hover:border-accent transition-all duration-200"
          >
            [linkedin]
          </a>
          <a
            href={contactJson.contact.social.X.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent border border-border-custom px-4 py-2 bg-card rounded-sm hover:border-accent transition-all duration-200"
          >
            [x]
          </a>
        </div>

        <span className="text-[10px] text-muted mt-6">
          {contactJson.contact.tel}
        </span>
      </div>
    </section>
  );
}
