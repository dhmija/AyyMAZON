"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ProductImageGalleryProps {
  images: Array<{ id: string; imageUrl: string }>;
  title: string;
  className?: string;
}

export function ProductImageGallery({
  images,
  title,
  className,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const list = images.length > 0 ? images : [{ id: "0", imageUrl: "https://via.placeholder.com/600x600?text=No+Image" }];
  const mainImage = list[selectedIndex]!.imageUrl;
  const hasMultiple = list.length > 1;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ x, y });
  };

  const handleMouseLeave = () => setZoomStyle(null);

  const prev = () => setSelectedIndex((i) => (i - 1 + list.length) % list.length);
  const next = () => setSelectedIndex((i) => (i + 1) % list.length);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Main image with zoom on hover */}
      <div className="relative group">
        <div
          ref={containerRef}
          className="relative w-full aspect-square max-w-lg bg-amazon-background rounded overflow-hidden border border-gray-200"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={mainImage}
            alt={title}
            fill
            className="object-contain p-4 transition-transform duration-150 ease-out"
            style={
              zoomStyle
                ? {
                    transform: "scale(1.8)",
                    transformOrigin: `${zoomStyle.x}% ${zoomStyle.y}%`,
                    cursor: "zoom-in",
                  }
                : undefined
            }
            sizes="(max-width: 768px) 100vw, 500px"
            unoptimized
            priority
          />
        </div>

        {/* Navigation arrows (only if multiple images) */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 border border-gray-200 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-5 h-5 text-amazon-text" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 border border-gray-200 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-5 h-5 text-amazon-text" />
            </button>
            {/* Dot indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {list.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors duration-200",
                    i === selectedIndex ? "bg-amazon-orange-dark" : "bg-gray-300"
                  )}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative shrink-0 w-16 h-16 rounded overflow-hidden transition-all duration-150",
                i === selectedIndex
                  ? "ring-2 ring-amazon-orange-dark border-2 border-transparent"
                  : "border-2 border-gray-200 hover:border-gray-400"
              )}
            >
              <Image
                src={img.imageUrl}
                alt={`${title} view ${i + 1}`}
                fill
                className="object-contain p-1"
                sizes="64px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );
}
