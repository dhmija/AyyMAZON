import { EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-amazon-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          title="Page not found"
          description="The page you're trying to reach doesn't exist or may have moved."
          actionHref="/"
          actionLabel="Go to homepage"
        />
      </div>
    </div>
  );
}