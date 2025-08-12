import React, { useEffect, useState } from 'react'
import { CheckBoxOption, FilterConfig, RangeOption, RatingOption } from './types/FilterTypes';
import RadiusFilter from './filters/RadiusFilter';
import CheckBoxFilter from './filters/CheckBoxFilter';
import RangerFilter from './filters/RangeFilter';
import RatingFilter from './filters/RadiusFilter';
import FilterSection from './filters/FilterSection';

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
  const [collapsedState, setCollapsedState] = useState<Record<string, boolean>>(
    filters.reduce((acc, filter) => ({
      ...acc,
      [filter.id]: filter.isCollapsed || false
    }), {})
  )

  const toggleCollapse = (filterId: string) => {
    setCollapsedState( prev => ({
      ...prev,
      [filterId] : !prev[filterId]
    }));
  }

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
      <div>
        <h3>{title}</h3>
      </div>

      <div>
        {visibleFilters.map((filter) => (
          <FilterSection
            key={filter.id}
            title={filter.title}
            isCollapsed={collapsedState[filter.id]}
            onToggle={() => toggleCollapse(filter.id)}
          >
            {renderFilterContent(filter)}
          </FilterSection>
        ))}

        {shouldLimitFilters && (
          <div>
            <button
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