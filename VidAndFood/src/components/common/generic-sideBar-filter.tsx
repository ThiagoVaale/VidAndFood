import React, { useEffect, useState } from 'react'

interface FilterConfig{
  id: string;
  title: string;
  content: React.ReactNode;
  isCollapsed?: boolean;
}   

interface GenericSideBarFilterProps {
  filters: FilterConfig[];
  title: string;
  maxVisibleFilters?: number;
  onFilterChange?: (filterId: string, value: any) => void;
  className?: string;
}

const GenericSidebarFilter: React.FC<GenericSideBarFilterProps> = ({
  filters,
  title,
  maxVisibleFilters,
  onFilterChange,
  className
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

  return (
    <div>SideBarFilter</div>
  )
}

export default GenericSidebarFilter