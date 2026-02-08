import React from "react";
import { RatingOption } from "../types/FilterTypes"; // Importa tus tipos
import StarRating from "../StarsRating";

interface RatingFilterProps {
  options?: RatingOption[]; // No lo usamos visualmente en las estrellas, pero viene del padre
  filterId: string;
  value: number | null; // El valor actual seleccionado
  onChange: (val: number) => void; // La función para actualizar el estado global
}

const RatingFilter: React.FC<RatingFilterProps> = ({
  value,
  onChange,
}) => {
  // Manejamos el cambio que viene desde StarRating
  const handleRatingChange = (newRating: number) => {
    onChange(newRating);
  };

  return (
    <div className="rating-filter-container py-2">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="text-muted small">Mínimo de estrellas:</span>
        <span className="fw-bold" style={{ color: "#a52a2a" }}>
          {value ? `${value}.0` : "Todos"}
        </span>
      </div>

      <StarRating
        rating={value || 0} // Si es null, pasamos 0
        mode="filter"       // Activamos el modo interactivo
        maxStars={5}
        size="1.4rem"
        onRatingChange={handleRatingChange} // Conectamos la lógica
      />
      
      {/* Texto de ayuda opcional */}
      <div className="mt-2 text-muted" style={{ fontSize: "0.75rem", fontStyle: "italic" }}>
        * Filtra vinos con {value || 0} o más estrellas.
      </div>
    </div>
  );
};

export default RatingFilter;