import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { RatingOption } from "../types/FilterTypes";
import { Star, StarFill } from "react-bootstrap-icons";
import { FilterDisclousure } from "../FilterDisclousure";

interface RatingFilterProps {
  options: RatingOption[];
  filterId: string;
  selectedValue?: string;
  onFilterChange?: (filterId: string, value: string) => void;
}

const RatingFilter: React.FC<RatingFilterProps> = ({
  options,
  filterId,
  selectedValue,
  onFilterChange,
}) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
      <div className="d-flex gap-1">
        {Array.from({ length: fullStars }, (_, i) => (
          <StarFill key={`fill-${i}`} color="#a52a2a" />
        ))}
        {hasHalf && <Star key="half" color="#a52a2a" />}
        {Array.from({ length: emptyStars }, (_, i) => (
          <Star key={`empty-${i}`} color="#d1d5db" />
        ))}
      </div>
    );
  };

  return (
  <div className="d-flex flex-column gap-3">
    {options.map((option) => (
      <label 
        key={option.value} 
        className="d-flex align-items-center gap-3 cursor-pointer mb-0"
      >
        <input
          type="radio"
          name={`rating-filter-${filterId}`}
          value={option.value}
          checked={selectedValue === option.value}
          onChange={() => onFilterChange?.(filterId, option.value)}
          className="form-check-input"
          style={{ transform: 'scale(0.9)' }}
        />
        <div className="d-flex align-items-center gap-2">
          {renderStars(option.rating)}
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            {option.rating}
          </span>
          <span className="text-dark" style={{ fontSize: '0.9rem' }}>
            {option.label}
          </span>
        </div>
      </label>
    ))}
  </div>
);
};

export default RatingFilter;
