"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    id: 1,
    image: "/promos/promo-1.webp",
    alt: "Акция Medina Pharm",
  },
  {
    id: 2,
    image: "/promos/promo-2.webp",
    alt: "Специальное предложение Medina Pharm",
  },
  {
    id: 3,
    image: "/promos/promo-3.webp",
    alt: "Витамины и БАДы Medina Pharm",
  },
];

export default function PromoSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const scrollToSlide = (index: number) => {
    if (!sliderRef.current) {
      return;
    }

    const slider = sliderRef.current;
    const width = slider.clientWidth;

    slider.scrollTo({
      left: width * index,
      behavior: "smooth",
    });

    setActiveSlide(index);
  };

  const handlePrevious = () => {
    const nextIndex =
      activeSlide === 0 ? slides.length - 1 : activeSlide - 1;

    scrollToSlide(nextIndex);
  };

  const handleNext = () => {
    const nextIndex =
      activeSlide === slides.length - 1 ? 0 : activeSlide + 1;

    scrollToSlide(nextIndex);
  };

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    const handleScroll = () => {
      const width = slider.clientWidth;

      if (!width) {
        return;
      }

      const index = Math.round(slider.scrollLeft / width);

      setActiveSlide(
        Math.min(Math.max(index, 0), slides.length - 1),
      );
    };

    slider.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      slider.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const nextIndex =
        activeSlide === slides.length - 1 ? 0 : activeSlide + 1;

      scrollToSlide(nextIndex);
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [activeSlide]);

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-8">
      <div className="group relative overflow-hidden rounded-3xl bg-[#eaf5ee]">
        {/* Slides */}
        <div
          ref={sliderRef}
          className="flex h-[220px] snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:h-[260px] lg:h-[300px]"
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative h-full min-w-full shrink-0 snap-start"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={slide.id === 1}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Previous */}
        <button
          type="button"
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/90 text-foreground shadow-sm backdrop-blur transition hover:bg-white group-hover:flex"
          aria-label="Предыдущий слайд"
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/90 text-foreground shadow-sm backdrop-blur transition hover:bg-white group-hover:flex"
          aria-label="Следующий слайд"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/10 px-3 py-2 backdrop-blur-sm">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => scrollToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                activeSlide === index
                  ? "w-6 bg-primary"
                  : "w-2 bg-white/80"
              }`}
              aria-label={`Перейти к слайду ${index + 1}`}
              aria-current={
                activeSlide === index ? "true" : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}