import { useMemo, useState } from "react";
import { CheckBoxOption } from "../types/FilterTypes";
import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";
import { X } from "react-bootstrap-icons";

interface CheckBoxFilterProps {
  options: CheckBoxOption[];
  filterId: string;
  value: string[];
  onChange: (ids: string[]) => void;
}

const CheckBoxFilter: React.FC<CheckBoxFilterProps> = ({
  options,
  filterId,
  value,
  onChange,
}) => {
  const isChecked = (id: string) => value.includes(id)

  const toggle = (id: string) => {
    const next = isChecked(id) ? value.filter(x => x !== id) : [ ...value, id ];
    onChange(next);
  }

  return (
    <div className="d-flex flex-column gap-3">
      {options.map((option) => {
        const checked = isChecked(option.id);

        return (
          <div
            key={option.id}
            className="d-flex align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center gap-3 flex-grow-1">
              <Checkbox
                checked={checked}
                onChange={() => toggle(option.id)}
                className="position-relative"
              >
                {({ checked }) => (
                  <div
                    className={`d-flex align-items-center justify-content-center border rounded ${
                      checked ? "bg-danger border-danger" : "bg-white border-secondary"
                    }`}
                    style={{
                      width: 18,
                      height: 18,
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    {checked && (
                      <CheckIcon
                        className="text-white"
                        style={{ width: 12, height: 12 }}
                      />
                    )}
                  </div>
                )}
              </Checkbox>

              <button
                type="button"
                onClick={() => toggle(option.id)}
                className="btn p-0 text-start"
                aria-pressed={checked}
                style={{ fontSize: "0.9rem", userSelect: "none" }}
              >
                {option.label}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CheckBoxFilter;