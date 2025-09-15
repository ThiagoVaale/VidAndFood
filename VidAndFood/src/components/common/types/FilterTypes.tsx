import React from "react";

export type FilterType = "checkbox" | "range" | "rating";

export type RangeValue = { min: number; max: number };
export type CheckboxValue = string[];
export type RatingValue = number | null;

export type ValueByType = {
  checkbox: CheckboxValue;
  range: RangeValue;
  rating: RatingValue;
};

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

export interface BaseFilterConfig {
  id: string;
  title: string;
  isCollapsed?: boolean;
}

export interface CheckboxFilterConfig extends BaseFilterConfig {
  type: "checkbox";
  options: CheckBoxOption[];
}

export interface RangeFilterConfig extends BaseFilterConfig {
  type: "range";
  options: RangeOption;
}

export interface RatingFilterConfig extends BaseFilterConfig {
  type: "rating";
  options: RatingOption[];
}

export type FilterConfig = CheckboxFilterConfig | RangeFilterConfig | RatingFilterConfig;

export type FilterState = Record<string, CheckboxValue | RangeValue | RatingValue | undefined>;
export interface GenericSideBarFilterProps {
  filters: FilterConfig[];
  title: string;
  maxVisibleFilters?: number;
  value?: FilterState;        
  defaultValue?: FilterState;
  onChange?: (next: FilterState) => void;
  onFilterChange?: <T extends FilterType>(filterId: string, value: ValueByType[T]) => void;
  rangeDebounceMs?: number;
  className?: string;
}
