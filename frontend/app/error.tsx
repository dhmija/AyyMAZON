"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 py-12 bg-amazon-background">
      <ErrorState
        title="Something went wrong!"
        description="We're sorry, but an unexpected error occurred while loading this page."
        onRetry={reset}
        homeHref="/"
      />
    </div>
  );
}