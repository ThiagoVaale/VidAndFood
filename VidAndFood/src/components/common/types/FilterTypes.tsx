export interface FilterConfig{
  id: string;
  type: 'checkbox' | 'range' | 'rating';
  title: string;
  content: React.ReactNode;
  isCollapsed?: boolean;
  options?: CheckBoxOption[] | RangeOption | RatingOption[]
} 

export interface CheckBoxOption {
    id: string;
    label: string;
    value: string;
    checked?: boolean;
}

export interface RangeOption {
    min: number;
    max: number;
    step?: number;
    currentMin?: number;
    currentMax?: number;
    unit?: number;
}

export interface RatingOption {
    value: string;
    label: string;
    rating: number;
}

export interface GenericSideBarFilterProps {
    filters: FilterConfig[];
    title: string;
    maxVisibleFilters?: number;
    onFilterChange?: (filterId: string, value: any) => void;
    className?: string;
}