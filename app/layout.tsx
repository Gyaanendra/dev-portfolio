import type { Metadata } from "next";
import { Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import "./globals.css";


const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dev-portfolio-taupe-five.vercel.app"),

  title: {
    default: "Gyanendra Prakash | AI & Full Stack Developer Portfolio",
    template: "%s | Gyanendra Prakash",
  },

  description:
    "Portfolio of Gyanendra Prakash — B.Tech Computer Science Engineering student at Bennett University, Greater Noida. Full Stack AI Engineer at Hypotenuse Analytics. Specializing in LLMs, AI agents, and intelligent systems. 3x Hackathon Winner.",

  keywords: [
    // Name variants
    "Gyanendra Prakash",
    "Gyanendra",
    "Gyaanendra",
    "G Prakash",
    "G.Prakash",
    // Education
    "Bennett University",
    "Bennett University Greater Noida",
    "B.Tech CSE Bennett",
    "B.Tech Computer Science Engineering",
    "BTech student portfolio",
    "Computer Science student India",
    "Greater Noida developer",
    // Technical
    "AI Engineer portfolio",
    "Full Stack AI Engineer",
    "LLM developer India",
    "AI agent developer",
    "Machine Learning engineer student",
    "Next.js developer portfolio",
    "React developer India",
    "Python AI developer",
    // Work
    "Hypotenuse Analytics",
    "Meera AI agent",
    "AI internship India",
    // Hackathons & general
    "hackathon winner India",
    "developer portfolio India",
    "student portfolio 2025",
    "CSE student portfolio",
    "Mohali developer",
    "Punjab developer",
  ],

  authors: [{ name: "Gyanendra Prakash", url: "https://dev-portfolio-taupe-five.vercel.app" }],
  creator: "Gyanendra Prakash",
  publisher: "Gyanendra Prakash",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://dev-portfolio-taupe-five.vercel.app",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://dev-portfolio-taupe-five.vercel.app",
    siteName: "Gyanendra Prakash Portfolio",
    title: "Gyanendra Prakash | AI & Full Stack Developer",
    description:
      "B.Tech CSE student at Bennett University, Greater Noida. Full Stack AI Engineer at Hypotenuse Analytics. Building LLMs, AI agents, and intelligent systems. 3x Hackathon Winner.",
    images: [
      {
        url: "/images/me1.jpg",
        width: 1200,
        height: 630,
        alt: "Gyanendra Prakash — AI & Full Stack Developer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Gyanendra Prakash | AI & Full Stack Developer",
    description:
      "B.Tech CSE at Bennett University, Greater Noida. Full Stack AI Engineer. Building LLMs, AI agents & more. 3x Hackathon Winner.",
    images: ["/images/me1.jpg"],
    creator: "@gyaanendra",
  },

  category: "technology",

  icons: {
    icon: "/p2.png",
    shortcut: "/p2.png",
    apple: "/p2.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    // Note: Default is light as requested by user ("keep the default light")
                    // So we only use prefers-color-scheme if user hasn't explicitly set light mode, 
                    // but since user requested "keep the default light", we can default to light.
                    // Let's check: if no preference exists, we default to light.
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        {/* JSON-LD Structured Data for Google Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://dev-portfolio-taupe-five.vercel.app/#person",
                  name: "Gyanendra Prakash",
                  alternateName: ["Gyaanendra", "G.Prakash", "G Prakash"],
                  url: "https://dev-portfolio-taupe-five.vercel.app",
                  image: "https://dev-portfolio-taupe-five.vercel.app/images/me1.jpg",
                  jobTitle: "Full Stack AI Engineer",
                  description:
                    "B.Tech Computer Science Engineering student at Bennett University, Greater Noida. Full Stack AI Engineer at Hypotenuse Analytics. Specializing in LLMs, AI agents, React, Next.js, and Python. 3x Hackathon Winner.",
                  knowsAbout: [
                    "Artificial Intelligence",
                    "Large Language Models",
                    "AI Agents",
                    "Full Stack Development",
                    "Next.js",
                    "React",
                    "Python",
                    "Machine Learning",
                  ],
                  alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: "Bennett University",
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: "Greater Noida",
                      addressRegion: "Uttar Pradesh",
                      addressCountry: "IN",
                    },
                    url: "https://bennett.edu.in",
                  },
                  worksFor: {
                    "@type": "Organization",
                    name: "Hypotenuse Analytics",
                    url: "https://www.hypotenuseanalytics.com",
                  },
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Mohali",
                    addressRegion: "Punjab",
                    addressCountry: "IN",
                  },
                  sameAs: [
                    "https://github.com/Gyaanendra",
                    "https://www.linkedin.com/in/gyaanendra",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://dev-portfolio-taupe-five.vercel.app/#website",
                  url: "https://dev-portfolio-taupe-five.vercel.app",
                  name: "Gyanendra Prakash Portfolio",
                  description:
                    "Personal developer portfolio of Gyanendra Prakash — AI engineer, B.Tech CSE student at Bennett University, Greater Noida.",
                  author: {
                    "@id": "https://dev-portfolio-taupe-five.vercel.app/#person",
                  },
                  inLanguage: "en-IN",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground transition-colors duration-300">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}

