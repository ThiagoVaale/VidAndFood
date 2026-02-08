import React from "react";
import { Star, StarFill, StarHalf } from "react-bootstrap-icons";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  color?: string;
  size?: string;
  showValue?: boolean;
  layout?: "vertical" | "horizontal";
  mode?: "default" | "filter"; 
  // Nueva prop para comunicar el cambio al padre
  onRatingChange?: (newRating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  color = "#a52a2a",
  size = "1.2rem", // Un poco más grande para facilitar el click
  showValue = false,
  layout = "horizontal",
  mode = "default",
  onRatingChange,
}) => {

  const handleStarClick = (index: number) => {
    // Si no me pasaron la función, no hago nada (modo solo lectura)
    if (!onRatingChange) return;

    const newValue = index + 1;
    // Si toco la misma estrella que ya está seleccionada, deselecciono (envío 0)
    if (newValue === rating) {
      onRatingChange(0);
    } else {
      onRatingChange(newValue);
    }
  };

  const cursorStyle = onRatingChange ? { cursor: "pointer" } : { cursor: "default" };

  const stars = Array.from({ length: maxStars }, (_, i) => {
    // LÓGICA DE FILTRO (Interactivo)
    if (mode === "filter") {
      // Usamos Math.floor para pintar enteros (si rating es 4.3, pinta 4)
      const isFilled = i < Math.floor(rating);
      
      const Icon = isFilled ? StarFill : Star;
      
      return (
        <Icon
          key={i}
          color={color}
          size={size}
          style={cursorStyle}
          onClick={() => handleStarClick(i)}
        />
      );
    } 
    // LÓGICA DEFAULT (Solo lectura con decimales)
    else {
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
      style={{ gap: "4px" }}
    >
      <div className="d-flex">{stars}</div>
      
      {showValue && (
        <span className="ms-2 fw-bold text-muted" style={{ fontSize: "0.9rem" }}>
          {rating > 0 ? `${rating.toFixed(1)}+` : ""}
        </span>
      )}
    </div>
  );
};

export default StarRating;