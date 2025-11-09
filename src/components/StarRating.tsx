import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

export const StarRating = ({ rating, maxStars = 5 }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {[...Array(maxStars)].map((_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < rating
              ? "fill-[hsl(var(--star))] text-[hsl(var(--star))]"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
};
