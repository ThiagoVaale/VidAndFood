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
      <div className="mb-2">
        <small className="text-muted">
          {formatPrice(minValue)} - {formatPrice(maxValue)}
        </small>
      </div>

      <div className="px-2">
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
              style={{ ...props.style, height: '36px', display: 'flex', width: '100%' }}
            >
              <div
                ref={props.ref}
                style={{
                  height: "8px",
                  width: "100%",
                  borderRadius: "4px",
                  background: getTrackBackground({
                    values,
                    colors: ["#E5E7EB", "#a52a2a", "#E5E7EB"],
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
                border: "2px solid #374151",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 2px 6px #AAA",
                cursor: "pointer",
                transform: isDragged ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.01s ease",
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default RangerFilter;
