import type { Branch } from '../types';

// Extend Window interface to include Leaflet
declare global {
  interface Window {
    L: any;
  }
}

/**
 * Create a map marker icon for a branch
 * @param isSelected - Whether the branch is currently selected
 * @returns Leaflet divIcon instance
 */
export const createBranchIcon = (isSelected: boolean): any => {
  if (!window.L) return null;

  return window.L.divIcon({
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
    html: `<div style="
      width:${isSelected ? 36 : 28}px;
      height:${isSelected ? 36 : 28}px;
      background:${isSelected ? '#d4af37' : '#0a1628'};
      border:3px solid ${isSelected ? '#0a1628' : '#d4af37'};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      transition:all 0.2s ease;
      box-shadow:0 4px 12px rgba(10,22,40,0.3);
    "></div>`,
  });
};

/**
 * Create popup HTML content for a branch
 * @param branch - Branch object to display in popup
 * @returns HTML string for popup content
 */
export const createBranchPopup = (branch: Branch): string => {
  return `
    <div style="font-family:'Jost',sans-serif;min-width:160px">
      <div style="font-weight:600;font-size:14px;color:#0a1628;margin-bottom:4px">${branch.name}</div>
      <div style="font-size:12px;color:#64748b">${branch.address}</div>
      <div style="font-size:12px;color:#64748b">${branch.city}</div>
    </div>
  `;
};

/**
 * Create a map marker icon for user location
 * @returns Leaflet divIcon instance for user location
 */
export const createUserIcon = (): any => {
  if (!window.L) return null;

  return window.L.divIcon({
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: `<div style="width:20px;height:20px;background:#0d4d56;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(13,77,86,0.25)"></div>`,
  });
};

/**
 * Initialize a Leaflet map instance
 * @param element - HTML element to render map in
 * @returns Leaflet map instance or null
 */
export const initializeMap = (element: HTMLElement | null): any => {
  if (!window.L || !element) return null;

  const map = window.L.map(element, {
    center: [51.505, -0.09],
    zoom: 6,
    zoomControl: false,
  });

  // Add tile layer
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  // Add zoom control
  window.L.control.zoom({ position: 'bottomright' }).addTo(map);

  return map;
};

/**
 * Create a branch marker on the map
 * @param branch - Branch to create marker for
 * @param isSelected - Whether the branch is selected
 * @param map - Leaflet map instance
 * @param onSelectBranch - Callback when marker is clicked
 * @returns Leaflet marker instance
 */
export const createBranchMarker = (
  branch: Branch,
  isSelected: boolean,
  map: any,
  onSelectBranch: (branch: Branch) => void
): any => {
  if (!window.L) return null;

  const marker = window.L.marker([branch.lat!, branch.lng!], {
    icon: createBranchIcon(isSelected),
  })
    .addTo(map)
    .bindPopup(createBranchPopup(branch), { maxWidth: 220 })
    .on('click', () => onSelectBranch(branch));

  if (isSelected) {
    marker.openPopup();
  }

  return marker;
};
