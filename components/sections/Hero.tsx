import Image from "next/image";
import dataJson from "@/data/data.json";

export default function Hero() {
  return (
    <section
      id="hero"
      className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12 pt-6 min-h-[50vh]"
    >
      <div className="flex-1 flex flex-col gap-6 text-left">
        {/* Huge screen-filling typography */}
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-serif leading-none tracking-tighter text-foreground select-none relative z-10 break-words">
          {"Hi, I'm"}
          <br />
          <span className="text-accent italic font-normal tracking-wide relative">
            Gyanendra
            <span className="inline-block animate-blink font-serif font-light absolute -right-6 sm:-right-8 md:-right-10 text-foreground">
              _
            </span>
          </span>
        </h1>

        <p className="max-w-xl text-sm md:text-base leading-relaxed text-muted mt-2">
          {dataJson.description}
        </p>
      </div>

      {/* Polaroid Overlapping Images Container */}
      <div className="relative w-[460px] h-[460px] md:h-[500px] flex-shrink-0 mt-8 md:mt-0 select-none">
        {/* Left Polaroid (p1) */}
        <div className="w-[270px] h-[320px] absolute left-0 top-24 rotate-[-8deg] bg-white border border-zinc-200/80 p-4 pb-12 shadow-[0_12px_24px_rgba(0,0,0,0.18)] z-20">
          {/* Pushpin */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 shadow-[0_2.5px_5px_rgba(0,0,0,0.45)] z-20 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-2 after:h-2 after:bg-white/40 after:rounded-full" />
          {/* Photo */}
          <div className="w-full h-[238px] relative overflow-hidden bg-zinc-100">
            <Image
              src="/p1.png"
              alt="Gyanendra portrait 1"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 270px"
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* Right Polaroid (p2) */}
        <div className="w-[270px] h-[320px] absolute right-0 top-12 rotate-[6deg] bg-white border border-zinc-200/80 p-4 pb-12 shadow-[0_16px_32px_rgba(0,0,0,0.22)] z-10">
          {/* Pushpin */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 shadow-[0_2.5px_5px_rgba(0,0,0,0.45)] z-20 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-2 after:h-2 after:bg-white/40 after:rounded-full" />
          {/* Photo */}
          <div className="w-full h-[238px] relative overflow-hidden bg-zinc-100">
            <Image
              src="/p2.png"
              alt="Gyanendra portrait 2"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 270px"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
