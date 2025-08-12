import React, { useEffect, useState } from 'react'
import { CheckBoxOption, FilterConfig, RangeOption, RatingOption } from './types/FilterTypes';
import RadiusFilter from './filters/RadiusFilter';
import CheckBoxFilter from './filters/CheckBoxFilter';
import RangerFilter from './filters/RangeFilter';
import RatingFilter from './filters/RadiusFilter';
import { FilterDisclousure } from './FilterDisclousure';

interface GenericSideBarFilterProps {
  filters: FilterConfig[];
  title: string;
  maxVisibleFilters?: number;
  onFilterChange?: (filterId: string, value: any) => void;
}

const GenericSidebarFilter: React.FC<GenericSideBarFilterProps> = ({
  filters,
  title,
  maxVisibleFilters,
  onFilterChange,
}) => {
  const [showAllFilters, setShowAllFilters] = useState(false)

  const shouldLimitFilters = maxVisibleFilters && maxVisibleFilters > 0 && filters.length > maxVisibleFilters
  const visibleFilters = shouldLimitFilters && !showAllFilters ? filters.slice(0, maxVisibleFilters) : filters
  const hiddenFilterCount = shouldLimitFilters ? filters.length - maxVisibleFilters : 0

  const renderFilterContent = (filter: FilterConfig) => {
    switch (filter.type){
      case 'checkbox':
        return (
          <CheckBoxFilter
            options={filter.options as CheckBoxOption[]}
            filterId={filter.id}
            onFilterChange={onFilterChange}
          />
        );
      case 'range':
        return (
          <RangerFilter
            options={filter.options as RangeOption}
            filterId={filter.id}
            onFilterChange={onFilterChange}
          />
        );
      case 'rating':
        return (
          <RatingFilter
            options={filter.options as RatingOption[]}
            filterId={filter.id}
            onFilterChange={onFilterChange}
          />
        );
      default:
        return null;
    }
  }
  return (
    <div>
      <div className="mb-4">
        <h3 className="h5 fw-bold">
          {title}
        </h3>
      </div>

      <div className="d-flex flex-column gap-2">
        {visibleFilters.map((filter) => (
          <FilterDisclousure 
            key={filter.id}
            title={filter.title}
            isCollapsed={filter.isCollapsed}
          >
            {renderFilterContent(filter)}
          </FilterDisclousure>
        ))}

        {shouldLimitFilters && (
          <div className="mt-3">
            <button
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => setShowAllFilters(!showAllFilters)}
            >
              {showAllFilters ? 'Mostrar menos filtros' : `Mostrar ${hiddenFilterCount} filtros más`}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default GenericSidebarFilter