# Gyanendra Prakash — Developer Portfolio

> A minimalist, editorial-style personal portfolio built with **Next.js 16**, **Tailwind CSS v4**, and **TypeScript**.  
> Live at → [dev-portfolio-taupe-five.vercel.app](https://dev-portfolio-taupe-five.vercel.app/)

---

## ✦ Overview

A personal portfolio for **Gyanendra Prakash**, a second-year B.Tech CSE student from Mohali, India — passionate about AI, LLMs, and intelligent systems. The site is built with an editorial minimalism aesthetic, premium micro-animations, and a modular component architecture.

---

## ✦ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.9 (Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Fonts | Google Fonts — Serif + Mono pairing |
| Scroll | Lenis (smooth scrolling) |
| Animations | CSS transitions, View Transitions API |
| Deploy | Vercel |
| Package Manager | pnpm |

---

## ✦ Project Structure

```
portfolio/
├── app/
│   ├── page.tsx              # Page orchestrator — nav, theme, scroll state
│   ├── layout.tsx            # Root layout, Lenis provider, font setup
│   └── globals.css           # Design tokens, animations, dark mode
│
├── components/
│   ├── LenisProvider.tsx     # Smooth scroll wrapper
│   └── sections/             # Modular section components
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── Skills.tsx
│       ├── Experience.tsx
│       ├── CodingProfiles.tsx
│       ├── Projects.tsx
│       ├── EducationClubs.tsx
│       ├── Activities.tsx
│       ├── Contact.tsx
│       └── Footer.tsx
│
├── data/                     # JSON content files (edit to update portfolio)
│   ├── data.json             # Name, bio, education
│   ├── work.json             # Work experience
│   ├── projects.json         # Projects showcase
│   ├── clubs.json            # Leadership & societies
│   ├── contact.json          # Social links, email, phone
│   ├── fun_activity.json     # Activities gallery
│   └── skills.json           # Skills inventory
│
├── utils/
│   └── text.tsx              # Markdown-bold renderer utility
│
└── public/                   # Static assets (images, PDFs, PNGs)
```

---

## ✦ Sections

| # | Section | File | Description |
|---|---|---|---|
| 01 | About | `sections/About.tsx` | Bio, summary, resume download |
| 02 | Skills | `sections/Skills.tsx` | Animated marquee skill rows |
| 03 | Experience | `sections/Experience.tsx` | Timeline of work history |
| 04 | Code Profiles | `sections/CodingProfiles.tsx` | GitHub contribution heatmap |
| 05 | Projects | `sections/Projects.tsx` | Showcased ML/AI/Full-stack projects |
| 06 | Education | `sections/EducationClubs.tsx` | Academic background |
| 07 | Leadership | `sections/EducationClubs.tsx` | Clubs and societies |
| 08 | Activities | `sections/Activities.tsx` | Hackathon & college life gallery |
| — | Contact | `sections/Contact.tsx` | Social links and contact CTA |
| — | Footer | `sections/Footer.tsx` | Copyright |

---

## ✦ Key Features

- **Staggered Curtain Navigation** — Clicking nav links triggers a 5-panel black curtain with a hollowed-out italic "Gyanendra" text reveal before scroll-jumping.
- **Theme Toggle with View Transitions** — A zoom-warp circular ripple effect animates between light and dark mode from the exact click coordinates.
- **Scroll Parallax on Projects** — Project screenshots translate vertically as you scroll, creating a depth parallax effect inside each card.
- **Lenis Smooth Scrolling** — Buttery smooth, spring-physics scrolling across the entire page.
- **Animated Marquee Skills** — Three rows of skills scroll in alternating directions in a seamless infinite loop.
- **Polaroid Hero Images** — Two overlapping polaroid-style photos with pushpin styling in the hero section.
- **Active Job Indicator** — A pulsing green dot highlights currently active (Present) roles in the experience timeline.
- **Scroll Fade-up Animations** — Sections and child items fade and slide up sequentially as they enter the viewport.
- **Custom Cursor** — A large dot custom cursor with hover expansion on interactive elements (desktop only).

---

## ✦ Content Updates

All portfolio content is data-driven through JSON files inside the `data/` directory. No component code needs to change for most updates:

| What to update | Edit file |
|---|---|
| Bio, summary, education | `data/data.json` |
| Work experience | `data/work.json` |
| Projects | `data/projects.json` |
| Clubs & leadership roles | `data/clubs.json` |
| Social links, email, phone | `data/contact.json` |
| Activities gallery images | `data/fun_activity.json` |

---

## ✦ Getting Started

### Prerequisites
- Node.js 18+
- pnpm

### Install & Run

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

---

## ✦ Deployment

The portfolio is deployed on **Vercel**. Push to `main` to trigger an automatic production deployment.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## ✦ License

Personal portfolio — not intended for direct reuse or redistribution.  
© 2026 Gyanendra Prakash.
