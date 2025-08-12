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
    <div className="d-flex flex-column gap-2">
      {options.map((option) => (
        <div key={option.id} className="d-flex align-items-center gap-2">
          <Checkbox
            checked={enabledOption.some(
              (selected) => selected.id === option.id
            )}
            onChange={(checked) => handleCheckBoxChange(option, checked)}
            className="form-check-input"
          >
            {({ checked }) => (
              <div
                className={`d-flex align-items-center justify-content-center ${
                  checked
                    ? "bg-primary border-primary"
                    : "bg-white border-secondary"
                }`}
                style={{ width: "16px", height: "16px", borderRadius: "3px" }}
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
          <label className="form-check-label mb-0">{option.label}</label>
        </div>
      ))}
    </div>
  );
};

export default CheckBoxFilter;
