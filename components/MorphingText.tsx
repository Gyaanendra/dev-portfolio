"use client";

import { useCallback, useEffect, useRef } from "react";

const morphTime = 1.5;
const cooldownTime = 2.2; // Cooldown display time per term

const useMorphingText = (texts: string[]) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current];
      if (!current1 || !current2) return;

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${Math.min(
        8 / invertedFraction - 8,
        100
      )}px)`;
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      current1.textContent = texts[textIndexRef.current % texts.length];
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts]
  );

  const doMorph = useCallback(
    (dt: number) => {
      morphRef.current += dt;
      let fraction = morphRef.current / morphTime;

      if (fraction > 1) {
        cooldownRef.current = cooldownTime;
        fraction = 1;
      }

      setStyles(fraction);

      if (fraction === 1) {
        textIndexRef.current++;
        morphRef.current = 0;
      }
    },
    [setStyles]
  );

  const doCooldown = useCallback(() => {
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2) {
      current2.style.filter = "none";
      current2.style.opacity = "100%";
      current1.style.filter = "none";
      current1.style.opacity = "0%";
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    timeRef.current = new Date();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      if (cooldownRef.current > 0) {
        cooldownRef.current -= dt;
        doCooldown();
      } else {
        doMorph(dt);
      }
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [doMorph, doCooldown]);

  return { text1Ref, text2Ref };
};

interface MorphingTextProps {
  className?: string;
  texts: string[];
}

const SvgFilters: React.FC = () => (
  <svg
    id="filters"
    className="fixed h-0 w-0 pointer-events-none"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
);

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className = "",
}) => {
  const { text1Ref, text2Ref } = useMorphingText(texts);

  return (
    <div
      className={`relative inline-flex items-center h-[1.25em] text-accent font-semibold tracking-wide select-none ${className}`}
      style={{ filter: "url(#threshold) blur(0.6px)" }}
    >
      <span
        ref={text1Ref}
        className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap"
      />
      <span
        ref={text2Ref}
        className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap"
      />
      <SvgFilters />
    </div>
  );
};
