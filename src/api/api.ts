import axios, { AxiosError } from 'axios';
import type { Branch } from '../types';
import type { BranchRawData, GraphqlResponse, BranchData, ApiError } from '../types/api';

/**
 * GraphQL API endpoint
 */
const ENDPOINT = 'https://cg.optimizely.com/content/v2?auth=iQEyR1jR1cBG5mnLQoRotCyNmKUgaO0DT5cRbJPKA3oZGGQo';

/**
 * GraphQL query to fetch branches
 * Updated to match new API response structure
 */
const BRANCHES_QUERY = `
  query GetBranches {
    Branch(limit: 100) {
      items {
        Name
        Street
        City
        Country
        CountryCode
        ZipCode
        Coordinates
        Phone
        Email
      }
    }
  }
`;

/**
 * Axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Parse coordinates from comma-separated string
 * @param coords - Coordinate string in format "latitude, longitude"
 * @returns Object with lat and lng, or null if parsing fails
 */
function parseCoordinates(coords: string): { lat: number; lng: number } | null {
  if (!coords || typeof coords !== 'string') {
    return null;
  }

  try {
    const parts = coords.split(',').map(c => c.trim());
    if (parts.length !== 2) {
      return null;
    }

    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);

    if (isNaN(lat) || isNaN(lng)) {
      return null;
    }

    return { lat, lng };
  } catch {
    return null;
  }
}

/**
 * Normalize raw API data to application's Branch model
 * @param item - Raw branch data from API
 * @param index - Array index for unique ID
 * @returns Normalized branch object
 */
function normalizeBranch(item: BranchRawData, index: number): Branch {
  const coordinates = parseCoordinates(item.Coordinates);

  return {
    id: index,
    name: item.Name || 'Unnamed Branch',
    address: item.Street || '',
    city: item.City || '',
    country: item.Country || '',
    countryCode: item.CountryCode || '',
    postalCode: item.ZipCode || '',
    lat: coordinates?.lat ?? null,
    lng: coordinates?.lng ?? null,
    phone: item.Phone || undefined,
    email: item.Email || undefined,
  };
}

/**
 * Fetch all branches from the GraphQL API
 * @returns Promise resolving to array of Branch objects
 * @throws ApiError if the request fails or returns errors
 */
export async function fetchBranches(): Promise<Branch[]> {
  try {
    const response = await apiClient.post<GraphqlResponse<BranchData>>(
      '',
      { query: BRANCHES_QUERY }
    );

    // Check for GraphQL errors
    if (response.data.errors && response.data.errors.length > 0) {
      const error: ApiError = {
        message: response.data.errors[0].message,
        graphqlErrors: response.data.errors,
      };
      throw error;
    }

    // Extract branch items
    const items = response.data.data?.Branch?.items ?? [];

    // Normalize data
    return items.map((item, index) => normalizeBranch(item, index));
  } catch (error) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<GraphqlResponse<BranchData>>;
      const apiError: ApiError = {
        message: axiosError.message || 'Network error occurred',
        status: axiosError.response?.status,
        graphqlErrors: axiosError.response?.data?.errors,
      };
      throw apiError;
    }

    // Re-throw API errors
    throw error;
  }
}

/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Filter branches by search query across all fields
 * Performs client-side filtering using OR logic - matches if ANY field contains the query
 * @param branches - Array of branches to filter
 * @param query - Search query string
 * @returns Filtered array of branches matching the search criteria
 *
 * @example
 * // Search for "downtown" - matches any field containing "downtown"
 * const results = filterBranches(branches, 'downtown');
 *
 * @example
 * // Empty string returns all branches
 * const allBranches = filterBranches(branches, '');
 */
export function filterBranches(branches: Branch[], query: string): Branch[] {
  const trimmedQuery = query.trim().toLowerCase();

  if (!trimmedQuery) {
    return branches;
  }

  return branches.filter((branch) =>
    branch.name.toLowerCase().includes(trimmedQuery) ||
    branch.city.toLowerCase().includes(trimmedQuery) ||
    branch.country.toLowerCase().includes(trimmedQuery) ||
    branch.address.toLowerCase().includes(trimmedQuery) ||
    branch.postalCode.toLowerCase().includes(trimmedQuery)
  );
}
