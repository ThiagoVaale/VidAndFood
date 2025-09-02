import { useState } from "react";
import { RatingOption } from "../types/FilterTypes";
import StarRating from "../StarsRating";

interface RatingFilterProps {
  options: RatingOption[];
  filterId: string;
  value: number | null,
  onChange: (value: number | null) => void;
}

const RatingFilter: React.FC<RatingFilterProps> = ({
  options,
  filterId,
  value,
  onChange,
}) => {
  return (
    <div className="d-flex flex-column gap-3">
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <label
            key={option.value}
            className="d-flex align-items-center gap-3 cursor-pointer mb-0 position-relative"
            style={{
              padding: "8px",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              backgroundColor: isSelected
                ? "rgba(220, 53, 69, 0.05)"
                : "transparent",
              border: isSelected
                ? "1px solid rgba(220, 53, 69, 0.2)"
                : "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.02)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <div className="position-relative">
              <input
                type="radio"
                name={`rating-filter-${filterId}`}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="position-absolute opacity-0"
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                }}
              />
              <div
                className={`border rounded-circle d-flex align-items-center justify-content-center ${
                  isSelected
                    ? "border-danger bg-danger"
                    : "border-secondary bg-white"
                }`}
                style={{
                  width: "16px",
                  height: "16px",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              >
                {isSelected && (
                  <div
                    className="rounded-circle bg-white"
                    style={{
                      width: "6px",
                      height: "6px",
                      transition: "all 0.15s ease",
                    }}
                  />
                )}
              </div>
            </div>

            <div className="d-flex align-items-center">
              <StarRating
                rating={option.value}
                maxStars={5}
                size="1rem"
                color="#a52a2a"
                showValue={true}
                layout="horizontal"
                mode="filter" 
              />
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default RatingFilter;
