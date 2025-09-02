  import { useState } from "react";
  import { RangeOption } from "../types/FilterTypes";
  import { getTrackBackground, Range } from "react-range";
  

  interface RangeFilterProps {
    options: RangeOption;
    filterId: string;
    value: { min: number; max: number }
    onChange: (value: { min: number; max: number}) => void;
    onFinalChange?: (value: { min: number; max: number}) => void;
  }

  const RangerFilter: React.FC<RangeFilterProps> = ({
    options,
    value,
    onChange,
    onFinalChange
  }) => {
    const values = [value.min, value.max];

    const handleRangeChange = (values: number[]) => {
      const [min, max] = values;
      onChange({ min, max })
    };

    const handleFinalRange = (values: number[]) => {
      if(!onFinalChange) {
        return;
      }
      const [min, max] = values
      onFinalChange({ min, max })
    }

    const formatPrice = (num: number) => {
      const fomatValuePrice = num.toLocaleString();
      return num >= options.max ? `$${fomatValuePrice}+` : `$${fomatValuePrice}`;
    };

    return (
    <div>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <span className="text-dark" style={{ fontSize: '0.9rem' }}> 
          {formatPrice(value.min)} - {formatPrice(value.max)}
        </span>
        <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: '500' }}>
          ({ options.unit ?? "ARS" })
        </span>
      </div>

      <div className="px-1 mb-4">
        <Range
          step={options.step || 100}
          min={options.min}
          max={options.max}
          values={values}
          onChange={handleRangeChange}
          onFinalChange={handleFinalRange}
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
                  height: "4px",
                  width: "100%",
                  borderRadius: "2px",
                  background: `linear-gradient(90deg,
                    #E9ECEF ${( (values[0]-options.min)/(options.max-options.min) )*100}%,
                    #A52A2A  ${( (values[0]-options.min)/(options.max-options.min) )*100}% ${( (values[1]-options.min)/(options.max-options.min) )*100}%,
                    #E9ECEF ${( (values[1]-options.min)/(options.max-options.min) )*100}%)`,
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
                height: "18px",
                width: "18px",
                borderRadius: "50%",
                backgroundColor: "#FFF",
                border: "2px solid #9ca3af",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transform: isDragged ? "scale(1.05)" : "scale(1)",
                transition: "transform .1s ease",
                outline: "none"
              }}
            />
          )}
        />
      </div>
    </div>
  );
  };

  export default RangerFilter;
