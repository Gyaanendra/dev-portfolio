import Image from "next/image";

export default function Leadership() {
  const clubHistory = [
    {
      logo: "/images/ais.jpg",
      badge: "AIS",
      title: "Junior Core Tech Member",
      club: "Artificial Intelligence Society",
      description:
        "Co-organized university-wide AI hackathons, managed live tech operations, and maintained web platform features.",
      rolePill: "Tech Member",
      dates: "Sep 2024 — Aug 2025",
      href: "https://www.linkedin.com/company/ais-bennett/posts/?feedView=all",
    },
    {
      logo: "/images/foss-bu.jpg",
      badge: "FOSS",
      title: "Core Member",
      club: "Free and Open Source Software Club",
      description:
        "Contributed to open-source student initiatives, conducted Git & Linux bootcamps, and mentored junior developers.",
      rolePill: "Member",
      dates: "Sep 2024 — May 2026",
      href: "https://www.linkedin.com/company/foss-bu/",
    },
    {
      logo: "/images/gfg-bu.jpg",
      badge: "GfG",
      title: "Tech Co-Head",
      club: "GeeksforGeeks Club",
      description:
        "Spearheaded competitive programming contests, weekly algorithmic problem-solving groups, and DSA hack-challenges.",
      rolePill: "Co-Head",
      dates: "Aug 2023 — May 2026",
      href: "https://www.linkedin.com/company/gfg-bu/",
    },
    {
      logo: "/images/ieee-bu.jpg",
      badge: "IEEE",
      title: "Tech Co-Head",
      club: "IEEE Student Branch",
      description:
        "Coordinated technical talks, hands-on software & IoT workshops, and contributed to flagship club symposiums.",
      rolePill: "Co-Head",
      dates: "Jan 2024 — May 2026",
      href: "https://www.linkedin.com/company/ieee-bu/",
    },
    {
      logo: "/images/ias.jpg",
      badge: "IAS",
      title: "Fullstack Developer",
      club: "International Affairs Society",
      description:
        "Architected and deployed a dynamic website with custom CMS to manage international delegations and conferences.",
      rolePill: "Dev Team",
      dates: "Feb 2025 — May 2025",
      href: "https://www.linkedin.com/company/international-affairs-society-bennet/",
    },
    {
      logo: "/images/spark.jpg",
      badge: "SPARK",
      title: "Technical Team Member",
      club: "SPARK E-Cell",
      description:
        "Engineered real-time live auctioning platform for 'Spark Auction Bid', featuring rapid 30-second timed startup bidding.",
      rolePill: "Tech Team",
      dates: "Aug 2023 — May 2024",
      href: "https://www.linkedin.com/company/spark-e-cell/",
    },
    {
      logo: "/images/clti.jpg",
      badge: "CLTI",
      title: "Technical Member",
      club: "Centre for Law, Technology & Innovation",
      description:
        "Key organizer for LexHack hackathon — an innovative hackathon fusing full-stack development with simulated courtroom defense.",
      rolePill: "Tech Member",
      dates: "Sep 2022 — May 2023",
      href: "https://www.linkedin.com/company/clti-bu/",
    },
  ];

  return (
    <section
      id="leadership"
      className="scroll-mt-24 flex flex-col gap-8 fade-up-element w-full"
    >
      {/* ─── SECTION 07: Leadership Header ─── */}
      <div className="border-b border-border-custom pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground">
          07 / Leadership
        </h2>
        <p className="text-xs sm:text-sm text-muted font-mono max-w-xs sm:text-right">
          Roles where I led teams, ran events, or shipped things beyond coursework.
        </p>
      </div>

      {/* ─── PRIMARY FEATURED ROLE: TECH LEAD @ DEAN CAREER CLOUD (DCC) ─── */}
      <div className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Current Pill + Dates + Logo */}
          <div className="md:col-span-3 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-3 font-mono">
            <div className="flex flex-col gap-2">
              <span className="inline-block w-fit px-2.5 py-0.5 rounded-sm border border-accent text-accent text-xs font-semibold uppercase tracking-wider">
                Current
              </span>
              <span className="text-xs sm:text-sm text-muted">
                Aug 2025 — Present
              </span>
            </div>

            {/* DCC Official Logo */}
            <div className="w-14 h-14 border border-border-custom rounded-lg bg-card p-1.5 shrink-0 relative overflow-hidden flex items-center justify-center shadow-xs mt-1">
              <Image
                src="/images/dcc.png"
                alt="Dean Career Cloud, Bennett University"
                width={48}
                height={48}
                className="object-contain dark:invert"
              />
            </div>
          </div>

          {/* Middle Column: Club Subtitle, Big Title, Narrative, Links */}
          <div className="md:col-span-6 flex flex-col gap-2 font-mono">
            <span className="text-xs sm:text-sm text-muted">
              Dean Career Cloud (DCC) · SCSET, Bennett University
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Tech Lead
            </h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-lg mt-1">
              Engineered the official career development web platform for SCSET, Bennett University (<span className="text-foreground font-semibold">dcc-wesbite.vercel.app</span>). Spearheaded digital career architecture empowering students through algorithmic bootcamps, 1-on-1 alumni mentorship circles, ATS resume vetting, and 24/7 placement query pipelines.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://dcc-wesbite.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent text-xs font-semibold hover:underline inline-flex items-center gap-1"
              >
                [Live Website ↗]
              </a>
              <a
                href="https://bennett.edu.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent text-xs font-semibold hover:underline inline-flex items-center gap-1 transition-colors"
              >
                [Bennett SCSET ↗]
              </a>
            </div>
          </div>

          {/* Right Column: Impact Metric Stats from Live Portal */}
          <div className="md:col-span-3 flex md:flex-col gap-8 md:gap-5 font-mono md:pl-4">
            <div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                250+
              </div>
              <div className="text-xs text-muted">
                mentorship sessions
              </div>
            </div>

            <div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                50+
              </div>
              <div className="text-xs text-muted">
                industry partners
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─── SECONDARY FEATURED ROLE: CTO @ ARTIFICIAL INTELLIGENCE SOCIETY ─── */}
      <div className="pt-6 border-t border-border-custom/60">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Executive Pill + Dates + Logo */}
          <div className="md:col-span-3 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-3 font-mono">
            <div className="flex flex-col gap-2">
              <span className="inline-block w-fit px-2.5 py-0.5 rounded-sm border border-border-custom text-muted text-xs font-semibold uppercase tracking-wider">
                Executive
              </span>
              <span className="text-xs sm:text-sm text-muted">
                Aug 2025 — May 2026
              </span>
            </div>

            {/* AIS Official Logo */}
            <div className="w-14 h-14 border border-border-custom rounded-lg bg-card p-1.5 shrink-0 relative overflow-hidden flex items-center justify-center shadow-xs mt-1">
              <Image
                src="/images/ais.jpg"
                alt="Artificial Intelligence Society"
                width={46}
                height={46}
                className="object-contain rounded-xs"
              />
            </div>
          </div>

          {/* Middle Column: Club Subtitle, Big Title, Narrative, Links */}
          <div className="md:col-span-6 flex flex-col gap-2 font-mono">
            <span className="text-xs sm:text-sm text-muted">
              Artificial Intelligence Society (AIS), Bennett University
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Chief Technical Officer
            </h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-lg mt-1">
              Led technical direction for AIS — directed AI workshops, organized campus hackathons, and rebuilt the society&apos;s website end to end.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/ais-bennett/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent text-xs font-semibold hover:underline inline-flex items-center gap-1"
              >
                [LinkedIn ↗]
              </a>
              <a
                href="https://ais-web-two.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent text-xs font-semibold hover:underline inline-flex items-center gap-1"
              >
                [Website ↗]
              </a>
            </div>
          </div>

          {/* Right Column: Impact Metric Stats */}
          <div className="md:col-span-3 flex md:flex-col gap-8 md:gap-5 font-mono md:pl-4">
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                6+
              </div>
              <div className="text-xs text-muted">
                events organized
              </div>
            </div>

            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                1
              </div>
              <div className="text-xs text-muted">
                society site shipped
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─── TABULAR ROWS: COMPREHENSIVE CLUB HISTORY WITH LOGOS ─── */}
      <div className="flex flex-col border-t border-border-custom font-mono mt-2">
        <div className="py-2.5 text-xs font-bold uppercase tracking-wider text-muted/70">
          Club Journey &amp; Technical Initiatives
        </div>
        {clubHistory.map((role, index) => (
          <div
            key={index}
            className="group flex flex-col md:flex-row md:items-center justify-between py-4 sm:py-5 border-b border-border-custom gap-4 transition-colors hover:bg-card/40 px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-xs"
          >
            {/* Left: Official Club Logo + Role Title & Club */}
            <div className="flex items-center gap-3.5 md:w-5/12">
              <div className="w-12 h-12 border border-border-custom rounded-lg bg-card p-1.5 shrink-0 relative overflow-hidden flex items-center justify-center shadow-xs group-hover:border-accent/50 transition-colors">
                <Image
                  src={role.logo}
                  alt={role.club}
                  width={38}
                  height={38}
                  className="object-contain rounded-xs"
                />
              </div>
              <div className="flex flex-col">
                <a
                  href={role.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-sm sm:text-base font-bold text-foreground hover:text-accent transition-colors"
                >
                  {role.title}
                </a>
                <span className="text-[11px] text-muted">
                  {role.club}
                </span>
              </div>
            </div>

            {/* Middle: One-line concise impact description */}
            <div className="md:w-4/12 text-xs text-muted leading-relaxed">
              {role.description}
            </div>

            {/* Right: Role Pill Badge & Dates */}
            <div className="md:w-3/12 flex md:flex-col md:items-end justify-between items-center gap-1 shrink-0">
              <span className="border border-border-custom text-muted text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider group-hover:border-accent/40 group-hover:text-foreground transition-colors">
                {role.rolePill}
              </span>
              <span className="text-[11px] text-muted">
                {role.dates}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── FOOTER NOTE ─── */}
      <div className="text-xs text-muted font-mono pt-1">
        Full history and LinkedIn links available on request.
      </div>
    </section>
  );
}
