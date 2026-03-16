"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const TRUNCATE_AT = 400;

export interface ProductDescriptionProps {
  description: string | null | undefined;
  title?: string;
  className?: string;
}

export function ProductDescription({
  description,
  title = "Product Description",
  className,
}: ProductDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (description?.length ?? 0) > TRUNCATE_AT;
  const shown =
    isLong && !expanded ? description!.slice(0, TRUNCATE_AT) + "…" : description;

  if (!description?.trim()) {
    return (
      <section className={cn("bg-amazon-card-bg rounded shadow-card p-6", className)}>
        <h2 className="text-amazon-text text-lg font-semibold mb-4">{title}</h2>
        <p className="text-amazon-text-muted text-sm">No description available.</p>
      </section>
    );
  }

  return (
    <section className={cn("bg-amazon-card-bg rounded shadow-card p-6", className)}>
      <h2 className="text-amazon-text text-lg font-semibold mb-4">{title}</h2>
      <div className="text-amazon-text text-sm whitespace-pre-line leading-7 max-w-3xl">
        {shown}
      </div>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-amazon-link-blue text-sm hover:underline"
        >
          {expanded ? "Show less ▲" : "Read more ▼"}
        </button>
      )}
    </section>
  );
}
