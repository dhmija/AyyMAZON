"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
  homeHref?: string;
  homeLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try again",
  homeHref,
  homeLabel = "Go home",
  className,
}: ErrorStateProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-red-200 bg-white p-6 text-center shadow-card animate-fade-up",
        className
      )}
      role="alert"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-xl text-red-600">
        <span aria-hidden>!</span>
      </div>
      <h2 className="text-amazon-text text-xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-amazon-text-muted">
        {description}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {onRetry && (
          <Button onClick={onRetry} className="min-w-[180px]">
            {retryLabel}
          </Button>
        )}
        {homeHref && (
          <Link
            href={homeHref}
            className="inline-flex min-w-[180px] items-center justify-center rounded-md border border-amazon-nav-mid bg-white px-4 py-2 text-sm font-medium text-amazon-text transition-all duration-200 hover:-translate-y-0.5 hover:bg-amazon-background hover:no-underline hover:shadow-card"
          >
            {homeLabel}
          </Link>
        )}
      </div>
    </section>
  );
}