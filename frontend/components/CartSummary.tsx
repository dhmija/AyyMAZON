"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface CartSummaryProps {
  /** Subtotal (sum of item prices) */
  subtotal: string | number;
  /** Estimated tax amount or percentage (e.g. "₹120" or "18%") */
  estimatedTax?: string | number;
  /** Total amount to pay */
  total: string | number;
  /** Disable proceed button (e.g. when cart is empty) */
  disabled?: boolean;
  /** Loading state for proceed button */
  isLoading?: boolean;
  className?: string;
}

function formatPrice(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return "₹0";
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function CartSummary({
  subtotal,
  estimatedTax,
  total,
  disabled = false,
  isLoading = false,
  className,
}: CartSummaryProps) {
  return (
    <div
      className={cn(
        "bg-amazon-card-bg rounded shadow-card border border-gray-200 p-4 h-fit transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover",
        className
      )}
    >
      {/* FREE delivery note */}
      <p className="text-green-700 text-sm font-medium mb-3">
        Your order qualifies for{" "}
        <span className="font-bold">FREE Delivery</span>.
      </p>

      <h2 className="text-amazon-text font-semibold text-lg mb-4">
        Order Summary
      </h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-amazon-text-muted">Items</dt>
          <dd className="font-medium text-amazon-text">
            {formatPrice(subtotal)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-amazon-text-muted">Delivery</dt>
          <dd className="font-medium text-green-700">FREE</dd>
        </div>
        {estimatedTax != null && (
          <div className="flex justify-between items-baseline">
            <dt className="text-amazon-text-muted">
              GST (18%)
            </dt>
            <dd className="font-medium text-amazon-text">
              {typeof estimatedTax === "number" || !Number.isNaN(parseFloat(String(estimatedTax)))
                ? formatPrice(estimatedTax)
                : String(estimatedTax)}
            </dd>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <dt className="font-semibold text-amazon-text">Order Total</dt>
          <dd className="font-semibold text-amazon-text text-lg">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>

      <Link href="/checkout" className="block mt-4">
        <Button
          fullWidth
          disabled={disabled}
          isLoading={isLoading}
          className="w-full"
        >
          Proceed to Buy
        </Button>
      </Link>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-amazon-text-muted">
        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
        </svg>
        Secure checkout — data encrypted
      </p>
    </div>
  );
}
