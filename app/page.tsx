"use client";

import { useEffect, useState, useRef } from "react";
import { useLenis } from "lenis/react";
import ThemeToggle from "@/components/ThemeToggle";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import CodingProfiles from "@/components/sections/CodingProfiles";
import Projects from "@/components/sections/Projects";
import EducationClubs from "@/components/sections/EducationClubs";
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

  // DOM References for high performance updates
  const cursorRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Setup scroll progress and custom cursor tracking
  useEffect(() => {
    // 1. Scroll Progress Handler
    const handleScroll = () => {
      if (progressBarRef.current) {
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        progressBarRef.current.style.width = `${progress}%`;
      }

      // Check current active section for minimal nav indicator
      const sections = ["about", "work", "projects", "activities", "contact"];
      let currentSection = "about";
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
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

    // 2. Custom Cursor Handler
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    // Attach custom hover events
    const addCursorHoverClass = () =>
      cursorRef.current?.classList.add("custom-cursor-hover");
    const removeCursorHoverClass = () =>
      cursorRef.current?.classList.remove("custom-cursor-hover");

    const setupInteractiveHover = () => {
      const interactives = document.querySelectorAll(
        "a, button, select, input, textarea, [role='button'], .interactive-hover",
      );
      interactives.forEach((item) => {
        item.addEventListener("mouseenter", addCursorHoverClass);
        item.addEventListener("mouseleave", removeCursorHoverClass);
      });
    };

    // 3. Intersection Observer for Scroll Fade-up Transitions
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
    window.addEventListener("mousemove", handleMouseMove);

    // Initial trigger
    handleScroll();
    setupInteractiveHover();

    // Re-check for hovers on dynamic updates
    const hoverInterval = setInterval(setupInteractiveHover, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(hoverInterval);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 antialiased overflow-x-hidden pb-12 selection:bg-accent selection:text-background font-mono">
      {/* Scroll Progress Bar */}
      <div ref={progressBarRef} className="scroll-progress-bar" />

      {/* Custom Mouse Cursor (Desktop) */}
      <div
        ref={cursorRef}
        className="custom-cursor hidden pointer-events-none md:block"
      />

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

      {/* Floating minimal nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl z-50 border border-border-custom bg-card/75 backdrop-blur-md rounded-full shadow-md transition-all duration-300">
        <div className="px-6 h-14 flex items-center justify-between">
          <a
            href="#"
            onClick={handleLogoClick}
            className="font-bold tracking-tight text-foreground transition-colors hover:text-accent font-serif text-xl sm:text-2xl"
          >
            G.Prakash
          </a>

          {/* Desktop nav links & theme toggle */}
          <div className="hidden md:flex items-center gap-5 text-xs sm:text-sm font-mono">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, "#about")}
              className={`hover:text-accent transition-colors duration-200 ${
                activeSection === "about" ? "text-accent font-bold" : "text-muted"
              }`}
            >
              [about]
            </a>
            <a
              href="#skills"
              onClick={(e) => handleNavClick(e, "#skills")}
              className={`hover:text-accent transition-colors duration-200 ${
                activeSection === "skills" ? "text-accent font-bold" : "text-muted"
              }`}
            >
              [skills]
            </a>
            <a
              href="#projects"
              onClick={(e) => handleNavClick(e, "#projects")}
              className={`hover:text-accent transition-colors duration-200 ${
                activeSection === "projects" ? "text-accent font-bold" : "text-muted"
              }`}
            >
              [projects]
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className={`hover:text-accent transition-colors duration-200 ${
                activeSection === "contact" ? "text-accent font-bold" : "text-muted"
              }`}
            >
              [contact]
            </a>

            <ThemeToggle className="ml-1 rounded-full" />
          </div>

          {/* Mobile Morphing Hamburger Button */}
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
            className="md:hidden relative z-50 flex flex-col justify-center items-center w-10 h-10 rounded-sm text-muted hover:text-accent focus:outline-none transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block w-5 h-[1.5px] bg-current rounded-full transition-transform duration-300 origin-center ${
                mobileMenuOpen ? "rotate-45 translate-y-[3px]" : "-translate-y-[4px]"
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-current rounded-full transition-opacity duration-200 ${
                mobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-current rounded-full transition-transform duration-300 origin-center ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[3px]" : "translate-y-[4px]"
              }`}
            />
          </button>
        </div>
      </nav>

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
      <main className="max-w-5xl mx-auto px-6 pt-32 flex flex-col gap-24 md:gap-36">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <CodingProfiles />
        <Projects />
        <EducationClubs />
        <Activities />
        <Contact />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
