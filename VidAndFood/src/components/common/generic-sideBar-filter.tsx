import React, { useRef, useState } from "react";
import {
  CheckBoxOption,
  CheckboxValue,
  FilterConfig,
  FilterState,
  GenericSideBarFilterProps,
  RangeOption,
  RangeValue,
  RatingOption,
  RatingValue,
  ValueByType,
} from "./types/FilterTypes";
import CheckBoxFilter from "./filters/CheckBoxFilter";
import RangerFilter from "./filters/RangeFilter";
import RatingFilter from "./filters/RadiusFilter";
import WineFilterDisclosure from "./FilterDisclosure";
import "./sidebar.css";

const GenericSidebarFilter: React.FC<GenericSideBarFilterProps> = ({
  filters,
  title,
  maxVisibleFilters,
  value,
  defaultValue,
  onChange,
  onFilterChange,
  rangeDebounceMs = 0,
}) => {
  const isControlled = value != null;
  const [internal, setInternal] = useState<FilterState>(defaultValue || {});
  const filterValues = isControlled ? (value as FilterState) : internal;
  const [showAllFilters, setShowAllFilters] = useState(false);

  const shouldLimitFilters =
    !!maxVisibleFilters &&
    maxVisibleFilters > 0 &&
    filters.length > maxVisibleFilters;

  const visibleFilters =
    shouldLimitFilters && !showAllFilters
      ? filters.slice(0, maxVisibleFilters)
      : filters;

  const hiddenFilterCount = shouldLimitFilters
    ? filters.length - (maxVisibleFilters || 0)
    : 0;

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emit = (next: FilterState, opts?: { isRange?: boolean }) => {
    if (!isControlled) {
      setInternal(next);
    }
    if (opts?.isRange && rangeDebounceMs > 0) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => onChange?.(next), rangeDebounceMs);
    } else {
      onChange?.(next);
    }
  };

  const update = <T extends keyof ValueByType>(
    filterId: string,
    nextValue: ValueByType[T],
    opts?: { isRange?: boolean }
  ) => {
    const next = { ...filterValues, [filterId]: nextValue };
    onFilterChange?.(filterId, nextValue);
    emit(next, opts);
  };

  const getPreviewContent = (filter: FilterConfig): string => {
    const val = filterValues[filter.id];

    if (filter.type === "range") {
      const opt = filter.options as RangeOption;
      const v: RangeValue = (val as RangeValue) ?? {
        min: opt.currentMin ?? opt.min,
        max: opt.currentMax ?? opt.max,
      };
      const formatType = (n: number) => {
        const s = n.toLocaleString();
        return n >= opt.max ? `${s}+` : s;
      };
      return `${formatType(v.min)} - ${formatType(v.max)}`;
    }

    if (filter.type === "rating") {
      const options = filter.options as RatingOption[];
      const selected = options.find((o) => o.value === val);
      return selected ? `+${selected.label.trim()}` : "";
    }

    if (filter.type === "checkbox") {
      const ids: string[] = Array.isArray(val) ? (val as string[]) : [];
      if (!ids.length) return "";
      const options = (filter.options as CheckBoxOption[]) || [];
      const labels = ids
        .map((id) => options.find((o) => o.id === id)?.label)
        .filter(Boolean) as string[];
      if (labels.length === 1) {
        return labels[0]!;
      }
      if (labels.length <= 3) {
        return labels.join(", ");
      }
      return `${labels.slice(0, 2).join(", ")} +${labels.length - 2}`;
    }
    return "";
  };

  const handleClickShowFilters = () => {
    setShowAllFilters(!showAllFilters);
  };

  const handleChangeCheckBox = React.useCallback(
    (id: string) => (ids: CheckboxValue) => update<"checkbox">(id, ids),
    [update]
  );

  const handleChangeRange = React.useCallback(
    (id: string) => (value: RangeValue) =>
      update<"range">(id, value, { isRange: true }),
    [update]
  );

  const handleFinalChangeRange = React.useCallback(
    (id: string) => (value: RangeValue) => update<"range">(id, value),
    [update]
  );

  const handleRatingChange = React.useCallback(
    (id: string) => (value: RatingValue) => update<"rating">(id, value),
    [update]
  );

  const renderFilterContent = (filter: FilterConfig) => {
    const current = filterValues[filter.id];

    switch (filter.type) {
      case "checkbox":
        return (
          <CheckBoxFilter
            options={filter.options as CheckBoxOption[]}
            filterId={filter.id}
            value={Array.isArray(current) ? (current as string[]) : []}
            onChange={handleChangeCheckBox(filter.id)}
          />
        );

      case "range": {
        const opt = filter.options;
        const value: RangeValue = (current as RangeValue) ?? {
          min: opt.currentMin ?? opt.min,
          max: opt.currentMax ?? opt.max,
        };
        return (
          <RangerFilter
            options={opt}
            filterId={filter.id}
            value={value}
            onChange={handleChangeRange(filter.id)}
            onFinalChange={handleFinalChangeRange(filter.id)}
          />
        );
      }

      case "rating":
        return (
          <RatingFilter
            options={filter.options as RatingOption[]}
            filterId={filter.id}
            value={typeof current === "number" ? (current as number) : null}
            onChange={handleRatingChange(filter.id)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-content">
        <div className="filter-container">
          <div className="filter-content">
            {visibleFilters.map((filter, index) => (
              <WineFilterDisclosure
                key={filter.id}
                title={filter.title}
                isCollapsed={filter.isCollapsed}
                previewContent={getPreviewContent(filter)}
                isLast={
                  index === visibleFilters.length - 1 && !shouldLimitFilters
                }
              >
                {renderFilterContent(filter)}
              </WineFilterDisclosure>
            ))}

            {shouldLimitFilters && (
              <div className="show-more-container">
                <button
                  className="show-more-button"
                  onClick={handleClickShowFilters}
                >
                  {showAllFilters
                    ? "Mostrar menos filtros"
                    : `Mostrar ${hiddenFilterCount} filtros más`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericSidebarFilter;
