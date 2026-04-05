import { useEffect, useRef, useCallback } from 'react';
import type { Branch, UserLocation } from '../types';
import { initializeMap, createBranchMarker, createUserIcon } from '../utils/mapHelpers';

// Extend Window interface to include Leaflet
declare global {
  interface Window {
    L: any;
  }
}

interface MapViewProps {
  branches: Branch[];
  selectedBranch: Branch | null;
  onSelectBranch: (branch: Branch) => void;
  userLocation: UserLocation | null;
}

// ============================================================================
// MAP VIEW COMPONENT
// ============================================================================

const MapView = ({ branches, selectedBranch, onSelectBranch, userLocation }: MapViewProps) => {
  // --------------------------------------------------------------------------
  // REFS
  // --------------------------------------------------------------------------
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);

  // --------------------------------------------------------------------------
  // MAP INITIALIZATION HANDLER
  // --------------------------------------------------------------------------
  const handleMapInitialization = useCallback(() => {
    if (!window.L || mapInstanceRef.current || !mapRef.current) return;

    const map = initializeMap(mapRef.current);
    if (map) {
      mapInstanceRef.current = map;
    }
  }, []);

  // --------------------------------------------------------------------------
  // MARKERS UPDATE HANDLER
  // --------------------------------------------------------------------------
  const updateMarkers = useCallback(() => {
    if (!window.L || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Filter valid branches
    const validBranches = branches.filter((b) => b.lat && b.lng);
    if (!validBranches.length) return;

    // Create new markers
    validBranches.forEach((branch) => {
      const isSelected = selectedBranch?.id === branch.id;
      const marker = createBranchMarker(branch, isSelected, map, onSelectBranch);

      if (marker) {
        // Pan to selected branch
        if (isSelected) {
          map.setView([branch.lat!, branch.lng!], 14, { animate: true });
        }
        markersRef.current.push(marker);
      }
    });

    // Fit bounds on first load (if no branch is selected)
    if (!selectedBranch && validBranches.length > 0) {
      const group = window.L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [branches, selectedBranch, onSelectBranch]);

  // --------------------------------------------------------------------------
  // PAN TO SELECTED BRANCH HANDLER
  // --------------------------------------------------------------------------
  const panToSelectedBranch = useCallback(() => {
    if (!window.L || !mapInstanceRef.current || !selectedBranch) return;

    const map = mapInstanceRef.current;

    if (selectedBranch.lat && selectedBranch.lng) {
      // Find and open popup for the selected branch marker
      const marker = markersRef.current.find((m) => {
        const latLng = m.getLatLng();
        return latLng.lat === selectedBranch.lat && latLng.lng === selectedBranch.lng;
      });

      if (marker) {
        marker.openPopup();
      }

      // Pan to the selected branch
      map.setView([selectedBranch.lat, selectedBranch.lng], 14, { animate: true });
    }
  }, [selectedBranch]);

  // --------------------------------------------------------------------------
  // USER LOCATION MARKER HANDLER
  // --------------------------------------------------------------------------
  const updateUserLocationMarker = useCallback(() => {
    if (!window.L || !mapInstanceRef.current || !userLocation) return;

    const map = mapInstanceRef.current;

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Create and add new user marker
    const userIcon = createUserIcon();
    if (userIcon) {
      userMarkerRef.current = window.L
        .marker([userLocation.lat, userLocation.lng], {
          icon: userIcon,
          zIndexOffset: 1000,
        })
        .addTo(map)
        .bindPopup('You are here');

      // Center map on user location
      map.setView([userLocation.lat, userLocation.lng], 12, { animate: true });
    }
  }, [userLocation]);

  // --------------------------------------------------------------------------
  // EFFECTS
  // --------------------------------------------------------------------------
  useEffect(() => {
    handleMapInitialization();
  }, [handleMapInitialization]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  useEffect(() => {
    panToSelectedBranch();
  }, [panToSelectedBranch]);

  useEffect(() => {
    updateUserLocationMarker();
  }, [updateUserLocationMarker]);

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(10,22,40,0.12)]">
      <div ref={mapRef} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md flex flex-col gap-1.5 z-[1000]">
        <div className="flex items-center gap-2 text-[11px] text-slate">
          <div className="w-3.5 h-3.5 bg-midnight border-2 border-gold rounded-full" />
          <span>Branch</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate">
          <div className="w-3.5 h-3.5 bg-gold border-2 border-midnight rounded-full" />
          <span>Selected</span>
        </div>
        {userLocation && (
          <div className="flex items-center gap-2 text-[11px] text-slate">
            <div className="w-3.5 h-3.5 bg-teal border-2 border-white rounded-full" />
            <span>You</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
