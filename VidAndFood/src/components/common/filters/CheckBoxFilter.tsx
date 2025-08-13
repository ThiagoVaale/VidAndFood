import { useState } from "react";
import { CheckBoxOption } from "../types/FilterTypes";
import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";
import { FilterDisclousure } from "../FilterDisclousure";

interface CheckBoxFilterProps {
  options: CheckBoxOption[];
  filterId: string;
  onFilterChange?: (filterId: string, value: CheckBoxOption[]) => void;
}

const CheckBoxFilter: React.FC<CheckBoxFilterProps> = ({
  options,
  filterId,
  onFilterChange,
}) => {
  const [enabledOption, setEnabledOption] = useState<CheckBoxOption[]>(
    options.filter((options) => options.checked)
  );

  const handleCheckBoxChange = (option: CheckBoxOption, checked: boolean) => {
    const updatedOptions = checked
      ? [...enabledOption, option]
      : enabledOption.filter((selected) => selected.id !== option.id);

    setEnabledOption(updatedOptions);
    onFilterChange?.(filterId, updatedOptions);
  };

  return (
    <div className="d-flex flex-column gap-3">
      {options.map((option) => (
        <div
          key={option.id}
          className="d-flex align-items-center justify-content-between"
        >
          <label className="d-flex align-items-center gap-3 cursor-pointer mb-0 flex-grow-1">
            <Checkbox
              checked={enabledOption.some(
                (selected) => selected.id === option.id
              )}
              onChange={(checked) => handleCheckBoxChange(option, checked)}
              className="position-relative"
            >
              {({ checked }) => (
                <div
                  className={`d-flex align-items-center justify-content-center border rounded ${
                    checked
                      ? "bg-danger border-danger"
                      : "bg-white border-secondary"
                  }`}
                  style={{
                    width: "18px",
                    height: "18px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {checked && (
                    <CheckIcon
                      className="text-white"
                      style={{ width: "12px", height: "12px" }}
                    />
                  )}
                </div>
              )}
            </Checkbox>
            <span className="text-dark" style={{ fontSize: "0.9rem" }}>
              {option.label}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckBoxFilter;
