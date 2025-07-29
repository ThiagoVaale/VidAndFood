import { Disclosure, DisclosureButton, Transition, DisclosurePanel  } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/16/solid";
import React from "react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  isCollapsed = false,
}) => {
  return (
    <Disclosure defaultOpen={!isCollapsed}>
      {({ open }) => (
        <>
          <DisclosureButton>
            <h5>{title}</h5>
            <CheckIcon className="size-20" />
          </DisclosureButton>
          <Transition

          />
          <DisclosurePanel>
            {children}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};
