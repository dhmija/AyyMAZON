"use client";

import { cn } from "@/lib/utils";

export interface SpecRow {
  label: string;
  value: string;
}

export interface ProductSpecificationsProps {
  specs: SpecRow[];
  title?: string;
  className?: string;
}

export function ProductSpecifications({
  specs,
  title = "Product Details",
  className,
}: ProductSpecificationsProps) {
  if (specs.length === 0) return null;

  return (
    <section className={cn("bg-amazon-card-bg rounded shadow-card p-6", className)}>
      <h2 className="text-amazon-text text-lg font-semibold mb-4">{title}</h2>
      <table className="w-full text-sm">
        <tbody>
          {specs.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-amazon-background" : undefined}
            >
              <td className="py-2 px-3 font-medium text-amazon-text-muted w-1/3 align-top">
                {row.label}
              </td>
              <td className="py-2 px-3 text-amazon-text">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
