"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

export interface CategorySectionProps {
  title: string;
  categories: CategoryItem[];
  /** Base path for category links */
  hrefBase?: string;
  className?: string;
}

export function CategorySection({
  title,
  categories,
  hrefBase = "/products/category",
  className,
}: CategorySectionProps) {
  if (categories.length === 0) return null;

  return (
    <section className={cn("bg-amazon-card-bg rounded shadow-card p-4", className)}>
      <h2 className="text-amazon-text text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`${hrefBase}/${cat.slug}`}
            className="group flex flex-col items-center p-4 rounded border border-gray-200 hover:border-amazon-orange-dark hover:shadow-card transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 bg-white"
          >
            <div className="relative w-full aspect-square max-w-[120px] rounded overflow-hidden bg-amazon-background mb-2">
              {cat.imageUrl ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  sizes="120px"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amazon-text-muted text-3xl">
                  {cat.name.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-amazon-text text-sm font-medium text-center line-clamp-2 transition-colors duration-200 group-hover:text-amazon-link-blue">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
