import { cn } from "@/lib/utils";

export interface DiscountBadgeProps {
  /** Discount percentage (e.g. 15 for 15%) */
  percentage: number | string;
  className?: string;
}

export function DiscountBadge({ percentage, className }: DiscountBadgeProps) {
  const value =
    typeof percentage === "string" ? parseInt(percentage, 10) : percentage;
  if (Number.isNaN(value) || value <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-600 text-white",
        className
      )}
      aria-label={`${value}% off`}
    >
      {value}% off
    </span>
  );
}
