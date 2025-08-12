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
        <>
          <DisclosureButton className="d-flex justify-content-between align-items-center w-100 border-top border-bottom py-4 px-1 fs-5 cursor-pointer bg-transparent border-0 text-start fw-bold">
            <span>{title}</span>
            <ChevronUpIcon
              className={`transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
              style={{ width: "20px", height: "20px" }}
            />
          </DisclosureButton>

          <DisclosurePanel
            className="py-3 px-3 text-secondary border-bottom"
            style={{ fontSize: "0.9rem" }}
          >
            {children}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};
