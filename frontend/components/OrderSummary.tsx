"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface OrderSummaryProps {
  /** Subtotal (sum of items) */
  subtotal: string | number;
  /** Optional delivery fee or message */
  deliveryMessage?: string;
  /** Grand total to pay */
  total: string | number;
  /** Label for the primary button */
  primaryButtonLabel?: string;
  /** Called when primary button is clicked (e.g. Place order) */
  onPrimaryAction?: () => void;
  /** Primary button loading state */
  isPrimaryLoading?: boolean;
  /** Disable primary button */
  primaryButtonDisabled?: boolean;
  /** Optional secondary button */
  secondaryButtonLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

function formatPrice(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return "₹0";
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function OrderSummary({
  subtotal,
  deliveryMessage = "Delivery charges calculated at checkout",
  total,
  primaryButtonLabel = "Place order",
  onPrimaryAction,
  isPrimaryLoading = false,
  primaryButtonDisabled = false,
  secondaryButtonLabel,
  onSecondaryAction,
  className,
}: OrderSummaryProps) {
  return (
    <div
      className={cn(
        "bg-amazon-card-bg rounded shadow-card p-4 border border-gray-200 transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover",
        className
      )}
    >
      <h3 className="text-amazon-text font-semibold text-lg mb-4">
        Order Summary
      </h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-amazon-text-muted">Subtotal</dt>
          <dd className="font-medium text-amazon-text">
            {formatPrice(subtotal)}
          </dd>
        </div>
        {deliveryMessage && (
          <div className="flex justify-between">
            <dt className="text-amazon-text-muted">Delivery</dt>
            <dd className="text-amazon-text-muted text-xs">{deliveryMessage}</dd>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <dt className="font-semibold text-amazon-text">Total</dt>
          <dd className="font-semibold text-amazon-text text-lg">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>
      {onPrimaryAction && (
        <Button
          fullWidth
          className="mt-4"
          onClick={onPrimaryAction}
          isLoading={isPrimaryLoading}
          disabled={primaryButtonDisabled}
        >
          {primaryButtonLabel}
        </Button>
      )}
      {secondaryButtonLabel && onSecondaryAction && (
        <Button
          variant="outline"
          fullWidth
          className="mt-2"
          onClick={onSecondaryAction}
        >
          {secondaryButtonLabel}
        </Button>
      )}
    </div>
  );
}
