/**
 * Core TypeScript type definitions for the Branch Finder application
 */

/**
 * Normalized branch data structure used throughout the application
 */
export interface Branch {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  countryCode: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
  phone?: string;
  email?: string;
  distance?: number | null;
}

/**
 * User's geolocation coordinates
 */
export interface UserLocation {
  lat: number;
  lng: number;
}

/**
 * Sort options for branch listing
 */
export type SortBy = 'name' | 'city' | 'distance';

/**
 * Source of branch selection (map, list, or drawer)
 */
export type SelectionSource = 'map' | 'list' | 'drawer';

/**
 * City filter state
 */
export type CityFilter = string[];

/**
 * Filter state combining search query and city filters
 */
export interface FilterState {
  query: string;
  activeCities: CityFilter;
  sortBy: SortBy;
}

/**
 * UI state for loading and error handling
 */
export interface UIState {
  loading: boolean;
  error: string | null;
  showMap: boolean;
}

/**
 * Selection state for branch interactions
 */
export interface SelectionState {
  selectedBranch: Branch | null;
}
