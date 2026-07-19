"use client";

import { useEffect, useState, useRef } from "react";
import { flushSync } from "react-dom";
import { useLenis } from "lenis/react";

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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeSection, setActiveSection] = useState<string>("about");

  const [isNavTransitioning, setIsNavTransitioning] = useState(false);
  const [isNavActive, setIsNavActive] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const lenis = useLenis();

  // Scroll to section handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (isNavTransitioning) return;

    setIsNavTransitioning(true);
    
    // 1. Start sliding bars down/up (30ms delay to register DOM insertion)
    setTimeout(() => {
      setIsNavActive(true);
    }, 30);

    // 2. Bars fully cover screen by 640ms. At 650ms, fade in the green hollow text "Gyanendra."
    setTimeout(() => {
      setIsTextVisible(true);
    }, 650);

    // 3. Keep text visible. At 1250ms, jump page scroll instantly under the hood while covered
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

    // 4. At 1450ms, start peeling the bars away AND fade the text out simultaneously
    setTimeout(() => {
      setIsTextVisible(false);
      setIsNavActive(false);
    }, 1450);

    // 5. At 2100ms (after bars fully open), unmount overlay
    setTimeout(() => {
      setIsNavTransitioning(false);
    }, 2100);
  };

  // Scroll to top logo handler
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isNavTransitioning) return;

    setIsNavTransitioning(true);
    
    // 1. Start sliding bars down/up
    setTimeout(() => {
      setIsNavActive(true);
    }, 30);

    // 2. Fade in the green hollow text
    setTimeout(() => {
      setIsTextVisible(true);
    }, 650);

    // 3. Jump page scroll instantly to top under the hood while covered
    setTimeout(() => {
      lenis?.scrollTo(0, {
        immediate: true,
      });
      if (!lenis) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      setActiveSection("about");
    }, 1250);

    // 4. Start peeling the bars away AND fade the text out simultaneously
    setTimeout(() => {
      setIsTextVisible(false);
      setIsNavActive(false);
    }, 1450);

    // 5. Unmount overlay
    setTimeout(() => {
      setIsNavTransitioning(false);
    }, 2100);
  };

  // DOM References for high performance updates
  const cursorRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTimeout(() => {
        setTheme(savedTheme);
      }, 0);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Light is default as requested ("keep the default light")
      setTimeout(() => {
        setTheme("light");
      }, 0);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Theme Toggle Handler
  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    
    document.documentElement.style.setProperty("--click-x", `${x}px`);
    document.documentElement.style.setProperty("--click-y", `${y}px`);

    const nextTheme = theme === "light" ? "dark" : "light";
    
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(nextTheme);
      localStorage.setItem("theme", nextTheme);
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
        if (nextTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      });
    });
  };

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

      {/* Cool staggered page transition curtain overlay */}
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

      {/* Sticky minimal nav */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-border-custom bg-background/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="#"
            onClick={handleLogoClick}
            className="font-bold tracking-tight text-foreground transition-colors hover:text-accent font-serif text-2xl"
          >
            G.Prakash
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, "#about")}
              className={`hover:text-accent transition-colors duration-200 ${
                activeSection === "about" ? "text-accent" : "text-muted"
              }`}
            >
              [about]
            </a>
            <a
              href="#projects"
              onClick={(e) => handleNavClick(e, "#projects")}
              className={`hover:text-accent transition-colors duration-200 ${
                activeSection === "projects" ? "text-accent" : "text-muted"
              }`}
            >
              [projects]
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className={`hover:text-accent transition-colors duration-200 ${
                activeSection === "contact" ? "text-accent" : "text-muted"
              }`}
            >
              [contact]
            </a>

            <button
              onClick={toggleTheme}
              className="ml-2 px-2 py-1 border border-border-custom hover:border-accent hover:text-accent bg-card transition-colors duration-200 text-xs flex items-center rounded"
              title="Toggle theme"
            >
              [{theme === "light" ? "dark" : "light"}]
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden flex flex-col gap-1.5 p-2 text-muted hover:text-accent transition-colors"
            aria-label="Open menu"
          >
            <span className="block w-5 h-[1.5px] bg-current rounded-full" />
            <span className="block w-5 h-[1.5px] bg-current rounded-full" />
            <span className="block w-5 h-[1.5px] bg-current rounded-full" />
          </button>
        </div>

        {/* Mobile slide-in panel */}
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
              mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Panel */}
          <div
            className={`fixed top-0 right-0 z-50 h-full w-56 bg-background border-l border-border-custom transition-transform duration-300 ease-out md:hidden ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col gap-2 p-8 pt-24">
              <a
                href="#about"
                onClick={(e) => { handleNavClick(e, "#about"); setMobileMenuOpen(false); }}
                className={`text-lg font-serif transition-colors ${
                  activeSection === "about" ? "text-accent" : "text-muted hover:text-accent"
                }`}
              >
                [about]
              </a>
              <a
                href="#projects"
                onClick={(e) => { handleNavClick(e, "#projects"); setMobileMenuOpen(false); }}
                className={`text-lg font-serif transition-colors ${
                  activeSection === "projects" ? "text-accent" : "text-muted hover:text-accent"
                }`}
              >
                [projects]
              </a>
              <a
                href="#contact"
                onClick={(e) => { handleNavClick(e, "#contact"); setMobileMenuOpen(false); }}
                className={`text-lg font-serif transition-colors ${
                  activeSection === "contact" ? "text-accent" : "text-muted hover:text-accent"
                }`}
              >
                [contact]
              </a>

              <div className="mt-6 pt-6 border-t border-border-custom">
                <button
                  onClick={(e) => { toggleTheme(e); setMobileMenuOpen(false); }}
                  className="text-sm text-muted hover:text-accent transition-colors font-mono"
                >
                  [{theme === "light" ? "dark" : "light"}]
                </button>
              </div>
            </div>
          </div>
        </>
      </nav>

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
