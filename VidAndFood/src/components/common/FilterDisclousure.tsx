import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

interface FilterDisclosureProps {
  title?: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
}

export const FilterDisclousure: React.FC<FilterDisclosureProps> = ({
  title,
  children,
  isCollapsed,
}) => {
  return (
  <Disclosure defaultOpen={!isCollapsed}>
    {({ open }) => (
      <div className="border-bottom" style={{ borderColor: '#f1f3f4 !important' }}> 
        <DisclosureButton className="d-flex justify-content-between align-items-center w-100 py-3 px-0 bg-transparent border-0 text-start">
          <span className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>
            {title}
          </span>
          <ChevronUpIcon
            className={`transition-all ${open ? "" : "rotate-180"}`}
            style={{ 
              width: "16px", 
              height: "16px",
              color: "#6c757d",
              transition: "transform 0.2s ease"
            }}
          />
        </DisclosureButton>

        <DisclosurePanel className="pb-4 px-0">
          {children}
        </DisclosurePanel>
      </div>
    )}
  </Disclosure>
);
};
