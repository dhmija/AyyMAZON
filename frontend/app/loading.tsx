export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-amazon-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-amazon-orange border-t-transparent rounded-full animate-spin"></div>
        <p className="text-amazon-text-muted font-medium">Loading...</p>
      </div>
    </div>
  );
}