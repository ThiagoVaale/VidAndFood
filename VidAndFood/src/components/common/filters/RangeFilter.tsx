import { useState } from "react";
import { RangeOption } from "../types/FilterTypes";
import { getTrackBackground, Range } from "react-range";
import { FilterDisclousure } from "../FilterDisclousure";

interface RangeFilterProps {
  options: RangeOption;
  filterId: string;
  onFilterChange?: (
    filterId: string,
    value: { min: number; max: number }
  ) => void;
}

const RangerFilter: React.FC<RangeFilterProps> = ({
  options,
  filterId,
  onFilterChange,
}) => {
  const [minValue, setMinValue] = useState(options.currentMin || options.min);
  const [maxValue, setMaxValue] = useState(options.currentMax || options.max);

  const values = [minValue, maxValue];

  const handleRangeChange = (newValues: number[]) => {
    const [newMin, newMax] = newValues;

    setMinValue(newMin);
    setMaxValue(newMax);
    onFilterChange?.(filterId, { min: newMin, max: newMax });
  };

  const formatPrice = (value: number) => {
    if (value >= options.max) {
      return `$${value.toLocaleString()}+`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
  <div>
    <div className="mb-3 d-flex justify-content-between align-items-center">
      <span className="fw-medium text-dark" style={{ fontSize: '0.9rem' }}>
        {formatPrice(minValue)} - {formatPrice(maxValue)}
      </span>
      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
        (ARS)
      </span>
    </div>

    <div className="px-2 mb-3">
      <Range
        step={options.step || 100}
        min={options.min}
        max={options.max}
        values={values}
        onChange={handleRangeChange}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{ 
              ...props.style, 
              height: '36px', 
              display: 'flex', 
              width: '100%' 
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: "6px",
                width: "100%",
                borderRadius: "3px",
                background: getTrackBackground({
                  values,
                  colors: ["#E9ECEF", "#DC3545", "#E9ECEF"],
                  min: options.min,
                  max: options.max,
                }),
                alignSelf: "center",
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "20px",
              width: "20px",
              borderRadius: "50%",
              backgroundColor: "#FFF",
              border: "2px solid #6C757D",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transform: isDragged ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.1s ease",
            }}
          />
        )}
      />
    </div>

    <div className="d-flex align-items-center gap-2">
      <input
        type="checkbox"
        id="discount-checkbox"
        className="form-check-input"
        style={{ transform: 'scale(0.9)' }}
      />
      <label 
        htmlFor="discount-checkbox" 
        className="form-check-label mb-0 text-muted"
        style={{ fontSize: '0.85rem' }}
      >
        Solo mostrar vinos con descuento
      </label>
    </div>
  </div>
);
};

export default RangerFilter;
