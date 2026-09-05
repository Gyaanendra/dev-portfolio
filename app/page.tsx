"use client";

import { useEffect, useState, useRef } from "react";
import { useLenis } from "lenis/react";
import ThemeToggle from "@/components/ThemeToggle";
import VerticalDock from "@/components/VerticalDock";
import ChatWidget from "@/components/chat/ChatWidget";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import CodingProfiles from "@/components/sections/CodingProfiles";
import Projects from "@/components/sections/Projects";
import Education from "@/components/sections/Education";
import Leadership from "@/components/sections/Leadership";
import Activities from "@/components/sections/Activities";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("about");

  const [isNavTransitioning, setIsNavTransitioning] = useState(false);
  const [isNavActive, setIsNavActive] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [menuOrigin, setMenuOrigin] = useState({ x: 0, y: 0 });

  const closeMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setClosing(false);
    }, 300);
  };

  const lenis = useLenis();

  // Scroll to section handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (isNavTransitioning) return;

    setIsNavTransitioning(true);
    
    // 1. Start sliding bars down/up
    setTimeout(() => {
      setIsNavActive(true);
    }, 30);

    // 2. Bars fully cover screen by 640ms. At 650ms, fade in text
    setTimeout(() => {
      setIsTextVisible(true);
    }, 650);

    // 3. Keep text visible. Jump page scroll under hood while covered
    setTimeout(() => {
      lenis?.scrollTo(targetId, {
        offset: -96,
        immediate: true,
      });
      if (!lenis) {
        const el = document.getElementById(targetId.substring(1));
        if (el) {
          el.scrollIntoView({ behavior: "auto" });
        }
      }
      setActiveSection(targetId.substring(1));
    }, 1250);

    // 4. Start peeling bars away AND fade text out simultaneously
    setTimeout(() => {
      setIsTextVisible(false);
      setIsNavActive(false);
    }, 1450);

    // 5. Unmount overlay
    setTimeout(() => {
      setIsNavTransitioning(false);
    }, 2100);
  };

  // Scroll to top logo handler
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isNavTransitioning) return;

    setIsNavTransitioning(true);
    
    setTimeout(() => {
      setIsNavActive(true);
    }, 30);

    setTimeout(() => {
      setIsTextVisible(true);
    }, 650);

    setTimeout(() => {
      lenis?.scrollTo(0, {
        immediate: true,
      });
      if (!lenis) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      setActiveSection("about");
    }, 1250);

    setTimeout(() => {
      setIsTextVisible(false);
      setIsNavActive(false);
    }, 1450);

    setTimeout(() => {
      setIsNavTransitioning(false);
    }, 2100);
  };

  // Setup scroll section detection
  useEffect(() => {
    // 1. Scroll Handler
    const handleScroll = () => {
      // Check current active section for dock navigation
      const sections = ["about", "skills", "work", "projects", "contact"];
      let currentSection = "about";
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            currentSection = sectionId;
          }
        }
      }
      setActiveSection(currentSection);

      // Update scroll parallax ratios
      const parallaxContainers = document.querySelectorAll(".parallax-container");
      parallaxContainers.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const entryPoint = window.innerHeight;
        const exitPoint = -rect.height;
        const totalDist = entryPoint - exitPoint;
        const currentPos = rect.top;
        const ratio = (entryPoint - currentPos) / totalDist;
        const clampedRatio = Math.max(0, Math.min(1, ratio));
        (el as HTMLElement).style.setProperty("--scroll-ratio", clampedRatio.toFixed(3));
      });
    };

    // 2. Intersection Observer for Scroll Fade-up Transitions
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-up-element");
    fadeElements.forEach((el) => observer.observe(el));

    // Listeners and initialization
    window.addEventListener("scroll", handleScroll);

    // Initial trigger
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 antialiased overflow-x-hidden pb-12 selection:bg-accent selection:text-background font-mono">
      {/* Staggered page transition curtain overlay */}
      {isNavTransitioning && (
        <div
          className={`fixed inset-0 z-[10002] flex transition-overlay ${
            isNavActive ? "active" : ""
          }`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="transition-bar"
            />
          ))}
          {/* Hollowed out text "Gyanendra" in green */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span
              className={`font-serif italic font-normal text-6xl md:text-8xl tracking-wide select-none curtain-transition-text ${
                isTextVisible ? "visible" : ""
              }`}
            >
              Gyanendra
            </span>
          </div>
        </div>
      )}

      {/* Left Side Middle Vertical Dock Station with Fluid Motion */}
      <div className="hidden md:block">
        <VerticalDock
          activeSection={activeSection}
          onNavClick={handleNavClick}
          onLogoClick={handleLogoClick}
        />
      </div>

      {/* Floating Mobile Top Bar with Logo & Hamburger */}
      <div className="md:hidden fixed top-3 left-4 right-4 z-50 flex items-center justify-between p-2 pl-4 rounded-full border border-border-custom bg-card/80 backdrop-blur-md shadow-md">
        <a
          href="#"
          onClick={handleLogoClick}
          className="font-bold tracking-tight text-foreground transition-colors hover:text-accent font-serif text-lg"
        >
          G.Prakash
        </a>

        <div className="flex items-center gap-2">
          <ThemeToggle className="w-8 h-8 rounded-full border-0 bg-transparent" />
          <button
            ref={hamburgerRef}
            onClick={() => {
              if (hamburgerRef.current) {
                const r = hamburgerRef.current.getBoundingClientRect();
                setMenuOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
              }
              if (mobileMenuOpen) {
                closeMenu();
              } else {
                setMobileMenuOpen(true);
              }
            }}
            className="flex flex-col justify-center items-center w-8 h-8 rounded-full text-muted hover:text-accent focus:outline-none transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block w-4 h-[1.5px] bg-current rounded-full transition-transform duration-300 origin-center ${
                mobileMenuOpen ? "rotate-45 translate-y-[2.5px]" : "-translate-y-[3px]"
              }`}
            />
            <span
              className={`block w-4 h-[1.5px] bg-current rounded-full transition-opacity duration-200 ${
                mobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block w-4 h-[1.5px] bg-current rounded-full transition-transform duration-300 origin-center ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[2.5px]" : "translate-y-[3px]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile circular menu overlay */}
      <div
        className={`mobile-menu-overlay fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden ${
          mobileMenuOpen ? "" : "pointer-events-none"
        }`}
        style={{
          clipPath: `circle(${mobileMenuOpen && !closing ? "141%" : "0%"} at ${menuOrigin.x || 9999}px ${menuOrigin.y || 0}px)`,
          transition: "clip-path 500ms cubic-bezier(0.22, 1, 0.36, 1), backdrop-filter 300ms ease",
        }}
        onClick={closeMenu}
      >
        {/* Content wrapper */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center justify-between h-full pt-28 pb-12 px-8 max-w-sm mx-auto"
        >
          {/* Section list */}
          <div className="flex flex-col items-center gap-8 w-full">
            {[
              { href: "#about", label: "[about]", id: "about", num: "01", delay: 140 },
              { href: "#projects", label: "[projects]", id: "projects", num: "02", delay: 220 },
              { href: "#contact", label: "[contact]", id: "contact", num: "03", delay: 300 },
            ].map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => { handleNavClick(e, item.href); closeMenu(); }}
                className="group relative flex items-center justify-between w-full pb-3 border-b border-border-custom font-serif text-3xl transition-all"
                style={{
                  transitionDuration: "400ms, 400ms, 200ms",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1), cubic-bezier(0.22, 1, 0.36, 1), ease",
                  transitionProperty: "opacity, transform, color",
                  transitionDelay: mobileMenuOpen && !closing ? `${item.delay}ms` : "0ms",
                  opacity: mobileMenuOpen && !closing ? 1 : 0,
                  transform: mobileMenuOpen && !closing ? "translateY(0)" : "translateY(24px)",
                }}
              >
                <span className="text-xs font-mono text-muted group-hover:text-accent transition-colors">
                  {item.num}.
                </span>
                <span className={activeSection === item.id ? "text-accent" : "text-foreground group-hover:text-accent transition-colors"}>
                  {item.label}
                </span>
              </a>
            ))}
          </div>

          {/* Footer Controls inside Mobile Menu */}
          <div
            className="flex flex-col items-center gap-6 w-full pt-6"
            style={{
              transitionDuration: "400ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              transitionProperty: "opacity, transform",
              transitionDelay: mobileMenuOpen && !closing ? "360ms" : "0ms",
              opacity: mobileMenuOpen && !closing ? 1 : 0,
              transform: mobileMenuOpen && !closing ? "translateY(0)" : "translateY(16px)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted font-mono">Theme:</span>
              <ThemeToggle />
            </div>

            {/* Social links */}
            <div className="flex items-center gap-6 text-xs text-muted font-mono">
              <a
                href="https://github.com/Gyaanendra"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                GitHub ↗
              </a>
              <a
                href="https://www.linkedin.com/in/gyaanendra"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 pt-16 sm:pt-20 md:pt-24 flex flex-col gap-24 md:gap-36">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <CodingProfiles />
        <Projects />
        <Education />
        <Leadership />
        <Activities />
        <Contact />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* FLOATING AI CHAT AGENT WIDGET */}
      <ChatWidget />
    </div>
  );
}
