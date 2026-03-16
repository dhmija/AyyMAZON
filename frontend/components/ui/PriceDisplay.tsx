import { cn } from "@/lib/utils";

export interface PriceDisplayProps {
  /** Current selling price (string to support decimal from API) */
  price: string | number;
  /** Original price before discount (optional) */
  originalPrice?: string | number | null;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  className?: string;
}

function formatPrice(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(n);
}

export function PriceDisplay({
  price,
  originalPrice,
  size = "md",
  className,
}: PriceDisplayProps) {
  const hasDiscount = originalPrice != null && Number(originalPrice) > Number(price);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("flex items-baseline gap-2 flex-wrap", className)}>
      <span className={cn("font-semibold text-amazon-text", sizeClasses[size])}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span
          className={cn(
            "text-amazon-text-muted line-through",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}
