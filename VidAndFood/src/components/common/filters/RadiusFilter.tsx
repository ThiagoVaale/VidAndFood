import React from "react";
import { RatingOption } from "../types/FilterTypes"; 
import StarRating from "../StarsRating";

interface RatingFilterProps {
  options?: RatingOption[]; 
  filterId: string;
  value: number | null; 
  onChange: (val: number) => void; 
}

const RatingFilter: React.FC<RatingFilterProps> = ({
  value,
  onChange,
}) => {
  const handleRatingChange = (newRating: number) => {
    onChange(newRating);
  };

  return (
    <div className="rating-filter-container py-2">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="text-muted small">Minimum number of stars:</span>
        <span className="fw-bold" style={{ color: "#a52a2a" }}>
          {value ? `${value}.0` : "Todos"}
        </span>
      </div>

      <StarRating
        rating={value || 0} 
        mode="filter"       
        maxStars={5}
        size="1.4rem"
        onRatingChange={handleRatingChange} 
      />
      
      <div className="mt-2 text-muted" style={{ fontSize: "0.75rem", fontStyle: "italic" }}>
        * Filters wines with {value || 0} or more stars.
      </div>
    </div>
  );
};

export default RatingFilter;