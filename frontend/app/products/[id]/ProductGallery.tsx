"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: Array<{ id: string; imageUrl: string }>;
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }

  const activeImage = images[activeIndex]?.imageUrl;

  return (
    <div className="flex gap-4">
      {/* Thumbnails (vertical) */}
      <div className="flex-col gap-2 hidden md:flex w-16">
        {images.map((img, idx) => (
          <button
            key={img.id || idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "w-12 h-12 relative rounded border",
              activeIndex === idx
                ? "border-amazon-link-blue shadow-[0_0_3px_2px_rgba(0,113,133,0.5)]"
                : "border-gray-200 hover:border-gray-400"
            )}
            onMouseEnter={() => setActiveIndex(idx)}
          >
            <Image
              src={img.imageUrl}
              alt={`${title} thumbnail ${idx + 1}`}
              fill
              className="object-contain p-1"
              sizes="48px"
              unoptimized
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative w-full aspect-square max-h-[500px]">
        {activeImage && (
          <Image
            src={activeImage}
            alt={title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 400px"
            priority /* Make the main image load fast */
            unoptimized
          />
        )}
      </div>
      
      {/* Mobile thumbnails (horizontal) */}
      <div className="flex gap-2 md:hidden w-full overflow-x-auto mt-4 px-2">
        {images.map((img, idx) => (
          <button
            key={img.id || idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "w-12 h-12 flex-shrink-0 relative rounded border",
              activeIndex === idx
                ? "border-amazon-link-blue shadow-[0_0_3px_2px_rgba(0,113,133,0.5)]"
                : "border-gray-200 hover:border-gray-400"
            )}
          >
            <Image
              src={img.imageUrl}
              alt={`${title} thumbnail ${idx + 1}`}
              fill
              className="object-contain p-1"
              sizes="48px"
              unoptimized
            />
          </button>
        ))}
      </div>
    </div>
  );
}
