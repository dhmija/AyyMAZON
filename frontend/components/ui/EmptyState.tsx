import Link from "next/link";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  secondaryActionHref?: string;
  secondaryActionLabel?: string;
  compact?: boolean;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  secondaryActionHref,
  secondaryActionLabel,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-dashed border-amber-300 bg-gradient-to-br from-amber-50 via-white to-orange-50 text-center animate-fade-up",
        compact ? "px-5 py-8" : "px-6 py-12 shadow-card",
        className
      )}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-card">
        <span aria-hidden>○</span>
      </div>
      <h2 className="text-amazon-text text-xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-amazon-text-muted">
        {description}
      </p>
      {(actionHref || secondaryActionHref) && (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {actionHref && actionLabel && (
            <Link
              href={actionHref}
              className="inline-flex min-w-[180px] items-center justify-center rounded-md border border-amazon-orange-dark bg-amazon-orange-dark px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-600 hover:no-underline hover:shadow-card"
            >
              {actionLabel}
            </Link>
          )}
          {secondaryActionHref && secondaryActionLabel && (
            <Link
              href={secondaryActionHref}
              className="inline-flex min-w-[180px] items-center justify-center rounded-md border border-amazon-nav-mid bg-white px-4 py-2 text-sm font-medium text-amazon-text transition-all duration-200 hover:-translate-y-0.5 hover:bg-amazon-background hover:no-underline hover:shadow-card"
            >
              {secondaryActionLabel}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}