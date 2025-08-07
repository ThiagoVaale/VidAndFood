import { Disclosure, DisclosureButton, Transition, DisclosurePanel  } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/16/solid";
import React from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
  onToggle: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  isCollapsed = false,
  onToggle
}) => {
  return (
    <div>
      <button onClick={onToggle}>
        <h5>{title}</h5>
        {isCollapsed ? (
          <ChevronDown/>
        ) : (
          <ChevronUp/>
        )}
      </button>
      {!isCollapsed && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
