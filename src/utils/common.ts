import type { Branch } from '../types';

/**
 * Toggle an item in an array (add if not present, remove if present)
 * @param array - The array to modify
 * @param item - The item to toggle
 * @returns New array with item toggled
 */
export function toggleArrayItem<T>(array: T[], item: T): T[] {
  return array.includes(item)
    ? array.filter((i) => i !== item)
    : [...array, item];
}

/**
 * Format distance for display
 * @param distance - Distance in kilometers
 * @returns Formatted distance string (e.g., "450m", "3.2km") or null
 */
export function formatDistance(distance: number | null): string | null {
  if (distance == null) return null;

  return distance < 1
    ? `${Math.round(distance * 1000)}m`
    : `${distance.toFixed(1)}km`;
}

/**
 * Build Google Maps URL for a branch
 * @param branch - Branch object with coordinates
 * @returns Google Maps URL for directions
 */
export function buildMapsUrl(branch: Branch): string {
  if (branch.lat && branch.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;
  }

  // Fallback to search if no coordinates
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${branch.name} ${branch.city}`)}`;
}

/**
 * Format location string from branch data
 * @param branch - Branch object
 * @returns Formatted location string (e.g., "address · city · country")
 */
export function formatLocationString(branch: Branch): string {
  return [branch.address, branch.city, branch.country]
    .filter(Boolean)
    .join(' · ');
}

/**
 * Create a debounced function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
