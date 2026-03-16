"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: string;
  imageUrl: string;
  alt?: string;
  href?: string;
}

export interface HeroCarouselProps {
  slides: HeroSlide[];
  /** Auto-rotate interval in ms (0 = off) */
  interval?: number;
  className?: string;
}

export function HeroCarousel({
  slides,
  interval = 5000,
  className,
}: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const count = slides.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent((count + index) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1 || !interval) return;
    const t = setInterval(() => goTo(current + 1), interval);
    return () => clearInterval(t);
  }, [count, interval, current, goTo]);

  if (count === 0) return null;

  const slide = slides[current];
  const content = (
    <div className="relative w-full aspect-[3/1] min-h-[120px] sm:min-h-[200px] md:min-h-[280px] bg-amazon-nav-mid">
      <Image
        src={slide.imageUrl}
        alt={slide.alt ?? "Promotion"}
        fill
        className="object-cover"
        sizes="100vw"
        priority
        unoptimized
      />
    </div>
  );

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {slide.href ? (
        <Link href={slide.href} className="block">
          {content}
        </Link>
      ) : (
        content
      )}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white text-amazon-text"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white text-amazon-text"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i === current ? "bg-white" : "bg-white/60 hover:bg-white/80"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );
}
