/**
 * API-related TypeScript type definitions
 */

/**
 * Raw branch data from GraphQL API response
 */
export interface BranchRawData {
  Name: string;
  Street: string;
  City: string;
  Country: string;
  CountryCode: string;
  ZipCode: string;
  Coordinates: string;
  Phone?: string;
  Email?: string;
}

/**
 * GraphQL response structure
 */
export interface GraphqlResponse<T> {
  data: T;
  errors?: GraphqlError[];
}

/**
 * GraphQL error structure
 */
export interface GraphqlError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
}

/**
 * API data structure containing branches
 */
export interface BranchData {
  Branch: {
    items: BranchRawData[];
  };
}

/**
 * API error structure
 */
export interface ApiError {
  message: string;
  status?: number;
  graphqlErrors?: GraphqlError[];
}
