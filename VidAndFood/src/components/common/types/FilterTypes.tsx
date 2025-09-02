export type FilterType = "checkbox" | "range" | "rating";

export interface FilterConfig {
  id: string;
  type: FilterType;
  title: string;
  content: React.ReactNode;
  isCollapsed?: boolean;
  options?: CheckBoxOption[] | RangeOption | RatingOption[];
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
  unit?: string;
}

export interface RatingOption {
  value: number;
  label: string;
  rating?: number;
}

export type FilterState = Record<string, string[] | { min: number ; max: number} | number | null>

export interface GenericSideBarFilterProps {
  filters: FilterConfig[];
  title: string;
  maxVisibleFilters?: number;
  value?: FilterState;
  defaultValue?: FilterState;
  onChange?: (next: FilterState) => void;
  onFilterChange?: (filterId: string, value: any) => void;
  rangeDebounceMs?: number;
  className?: string;
}
