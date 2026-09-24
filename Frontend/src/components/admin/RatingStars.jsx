export default function RatingStars({ rating = 0 }) {
  const value = Math.max(0, Math.min(5, Number(rating)));

  return (
    <span className="rating-stars" aria-label={`${value} out of 5`}>
      {"★".repeat(Math.round(value))}
      {"☆".repeat(5 - Math.round(value))}
    </span>
  );
}
