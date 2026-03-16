export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>
          {rating >= i + 1 ? "★" : rating >= i + 0.5 ? "★" : "☆"}
        </span>
      ))}
      <span className="ml-1 text-amazon-text-muted">{rating.toFixed(1)}</span>
    </div>
  );
}
