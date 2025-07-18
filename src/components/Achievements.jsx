// src/components/AchievementsCarousel.jsx
import { useState, useEffect } from "react";

const AchievementsCarousel = ({ achievements }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality - runs infinitely
  useEffect(() => {
    if (!isAutoPlaying || !achievements || achievements.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % achievements.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [isAutoPlaying, achievements?.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % achievements.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + achievements.length) % achievements.length
    );
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // Guard clause for empty achievements
  if (!achievements || achievements.length === 0) {
    return (
      <div className="relative w-full">
        <div className="space-y-12 w-full py-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Achievements
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                No achievements to display yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="space-y-12 w-full py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Achievements
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              During my time in university, I attended 4 hackathons. I like to
              keep exploring and learning new things.
            </p>
          </div>
        </div>
      </div>

      {/* Carousel wrapper */}
      <div
        className="relative h-56 overflow-hidden rounded-lg md:h-96"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={achievement.image}
              className="absolute block w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt={achievement.title}
            />
            {/* Overlay with achievement info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-white text-xl font-bold mb-1">
                {achievement.title}
              </h3>
              <p className="text-white/90 text-sm mb-1">{achievement.dates}</p>
              <p className="text-white/75 text-sm">{achievement.location}</p>
            </div>
          </div>
        ))}

        {/* Previous button - positioned within carousel */}
        <button
          type="button"
          className="absolute top-1/2 left-4 -translate-y-1/2 z-30 flex items-center justify-center cursor-pointer group focus:outline-none"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white/50 group-focus:outline-none transition-all duration-300">
            <svg
              className="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </span>
        </button>

        {/* Next button - positioned within carousel */}
        <button
          type="button"
          className="absolute top-1/2 right-4 -translate-y-1/2 z-30 flex items-center justify-center cursor-pointer group focus:outline-none"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white/50 group-focus:outline-none transition-all duration-300">
            <svg
              className="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </span>
        </button>

        {/* Slider indicators - positioned within carousel */}
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
          {achievements.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-current={index === currentIndex ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsCarousel;
