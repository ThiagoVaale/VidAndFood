import { Star, StarFill, StarHalf } from "react-bootstrap-icons";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  color?: string;
  size?: string;
  showValue?: boolean;
  layout?: "vertical" | "horizontal";
  mode?: "default" | "filter"; 
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  color = "#a52a2a",
  size = "1rem",
  showValue = false,
  layout = "horizontal",
  mode = "default",
}) => {
   const stars = Array.from({ length: maxStars }, (_, i) => {
    if (mode === "filter") {
      return i < rating ? <StarFill key={i} color={color} size={size} /> : <Star key={i} color={color} size={size} />;
    } else {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
      if (i < fullStars) return <StarFill key={i} color={color} size={size} />;
      if (i === fullStars && hasHalfStar) return <StarHalf key={i} color={color} size={size} />;
      return <Star key={i} color={color} size={size} />;
    }
  });

  return (
    <div
      className={`d-flex ${
        layout === "vertical"
          ? "flex-column align-items-center"
          : "flex-row align-items-center"
      }`}
    >
      {showValue && layout === "vertical" && (
        <span
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#2c3e50",
            marginBottom: "4px",
          }}
        >
          {rating.toFixed(1)}
        </span>
      )}

      <div className="d-flex">{stars}</div>

      {showValue && layout === "horizontal" && (
        <span
          style={{
            marginLeft: "8px",
            fontSize: "0.9rem",
            fontWeight: "600",
            color: "#2c3e50",
          }}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
