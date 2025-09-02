import React, { useRef, useState } from "react";
import {
  CheckBoxOption,
  FilterConfig,
  FilterState,
  GenericSideBarFilterProps,
  RangeOption,
  RatingOption,
} from "./types/FilterTypes";
import CheckBoxFilter from "./filters/CheckBoxFilter";
import RangerFilter from "./filters/RangeFilter";
import RatingFilter from "./filters/RadiusFilter";
import WineFilterDisclosure from "./FilterDisclousure";
import "./sidebar.css"; 
import { Upload } from "react-bootstrap-icons";

const GenericSidebarFilter: React.FC<GenericSideBarFilterProps> = ({
  filters,
  title,
  maxVisibleFilters,
  value,
  defaultValue,
  onChange,
  onFilterChange,
  rangeDebounceMs = 0
}) => {
  const isControlled = value != null
  const [internal, setInternal] = useState<FilterState>(defaultValue || {})
  const filterValues = isControlled ? (value as FilterState) : internal

  const [showAllFilters, setShowAllFilters] = useState(false);
  const shouldLimitFilters = !!maxVisibleFilters && maxVisibleFilters > 0 && filters.length > maxVisibleFilters;
  const visibleFilters = shouldLimitFilters && !showAllFilters ? filters.slice(0, maxVisibleFilters) : filters;
  const hiddenFilterCount = shouldLimitFilters ? filters.length - (maxVisibleFilters || 0) : 0;

  const debounceRef = useRef<any>(null);

  const emit = (next: FilterState, options?: { isRange?: boolean }) => {
    if (!isControlled){
      setInternal(next);
    }
    if (options?.isRange && rangeDebounceMs > 0) {
      if (debounceRef.current){
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => onChange?.(next), rangeDebounceMs);
    } else {
      onChange?.(next);
    }
  };

  const update = (filterId: string, nextValue: any, options?: { isRange?: boolean }) => {
    const next = { ...filterValues, [filterId]: nextValue };
    onFilterChange?.(filterId, nextValue);
    emit(next, options);
  };

  const getPreviewContent = (filter: FilterConfig): string => {
    const value = filterValues[filter.id];

    if (filter.type === "range") {
      const opt = filter.options as RangeOption;
      const v = (value as any) ?? { min: opt.currentMin ?? opt.min, max: opt.currentMax ?? opt.max };
      const formatPrice = (n: number) => {
        const s = n.toLocaleString();
        return n >= opt.max ? `${s}+` : s;
      };
      return `${formatPrice(v.min)} – ${formatPrice(v.max)}`;
    }
    if (filter.type === "rating") {
      const options = filter.options as RatingOption[];
      const selected = options.find((o) => o.value === value);
      return selected ? `+${selected.label.trim()}` : "";
    }
    if (filter.type === "checkbox") {
      const ids: string[] = Array.isArray(value) ? (value as string[]) : [];
      if (!ids.length){
        return "";
      }
      const options = (filter.options as CheckBoxOption[]) || [];
      const labels = ids
        .map((id) => options.find((o) => o.id === id)?.label)
        .filter(Boolean) as string[];

      if (labels.length === 1){
        return labels[0]!;
      } 
      if (labels.length <= 3){
        return labels.join(", ");
      } 
      return `${labels.slice(0, 2).join(", ")} +${labels.length - 2}`;
    }
    return "";
  };

  const renderFilterContent = (filter: FilterConfig) => {
    const current = filterValues[filter.id];

    switch (filter.type) {
      case "checkbox":
        return (
          <CheckBoxFilter
            options={filter.options as CheckBoxOption[]}
            filterId={filter.id}
            value={Array.isArray(current) ? (current as string[]) : []}
            onChange={ ids => update(filter.id, ids)}
          />
        );
      case "range":{
        const options = filter.options as RangeOption;
        const currency = (current as any) ?? {
          min: options.currentMin ?? options.min,
          max: options.currentMax ?? options.max,
        };
        return (
          <RangerFilter
            options={options}
            filterId={filter.id}
            value={currency}
            onChange={ value => update(filter.id, value, { isRange: true })}
            onFinalChange={ value => update(filter.id, value )}
          />
        );
      }
      case "rating":
        return (
          <RatingFilter
            options={filter.options as RatingOption[]}
            filterId={filter.id}
            value={typeof current === "number" ? (current as number) : null}
            onChange={ v => update(filter.id, v)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="filter-container">
      <div className="filter-content">
        {visibleFilters.map((filter, index) => (
          <WineFilterDisclosure
            key={filter.id}
            title={filter.title}
            isCollapsed={filter.isCollapsed}
            previewContent={getPreviewContent(filter)}
            isLast={index === visibleFilters.length - 1 && !shouldLimitFilters}
          >
            {renderFilterContent(filter)}
          </WineFilterDisclosure>
        ))}

        {shouldLimitFilters && (
          <div className="show-more-container">
            <button
              className="show-more-button"
              onClick={() => setShowAllFilters(!showAllFilters)}
            >
              {showAllFilters
                ? "Mostrar menos filtros"
                : `Mostrar ${hiddenFilterCount} filtros más`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericSidebarFilter;
