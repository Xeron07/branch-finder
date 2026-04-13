import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Branch, UserLocation } from "../types";
import {
  initializeMap,
  createBranchMarker,
  createUserIcon,
} from "../utils/mapHelpers";

interface MapViewProps {
  branches: Branch[];
  selectedBranch: Branch | null;
  onSelectBranch: (branch: Branch) => void;
  userLocation: UserLocation | null;
}

// ============================================================================
// MAP VIEW COMPONENT
// ============================================================================

const MapView = ({
  branches,
  selectedBranch,
  onSelectBranch,
  userLocation,
}: MapViewProps) => {
  // --------------------------------------------------------------------------
  // REFS
  // --------------------------------------------------------------------------
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // --------------------------------------------------------------------------
  // MAP INITIALIZATION HANDLER
  // --------------------------------------------------------------------------
  const handleMapInitialization = useCallback(() => {
    // Guard: already initialized or DOM element not ready
    if (mapInstanceRef.current || !mapRef.current) return;

    mapInstanceRef.current = initializeMap(mapRef.current);
  }, []);

  // --------------------------------------------------------------------------
  // MARKERS UPDATE HANDLER
  // --------------------------------------------------------------------------
  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Filter branches that have valid coordinates
    const validBranches = branches.filter((b) => b.lat && b.lng);
    if (!validBranches.length) return;

    // Create new markers
    validBranches.forEach((branch) => {
      const isSelected = selectedBranch?.id === branch.id;
      const marker = createBranchMarker(
        branch,
        isSelected,
        map,
        onSelectBranch,
      );

      // Pan to selected branch
      if (isSelected) {
        map.setView([branch.lat!, branch.lng!], 14, { animate: true });
      }

      markersRef.current.push(marker);
    });

    // Fit all markers in view on first load when nothing is selected
    if (!selectedBranch && validBranches.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [branches, selectedBranch, onSelectBranch]);

  // --------------------------------------------------------------------------
  // PAN TO SELECTED BRANCH HANDLER
  // --------------------------------------------------------------------------
  const panToSelectedBranch = useCallback(() => {
    if (!mapInstanceRef.current || !selectedBranch) return;

    const map = mapInstanceRef.current;

    if (selectedBranch.lat && selectedBranch.lng) {
      // Find matching marker by lat/lng and open its popup
      const marker = markersRef.current.find((m) => {
        const latLng = m.getLatLng();
        return (
          latLng.lat === selectedBranch.lat && latLng.lng === selectedBranch.lng
        );
      });

      if (marker) {
        marker.openPopup();
      }

      map.setView([selectedBranch.lat, selectedBranch.lng], 14, {
        animate: true,
      });
    }
  }, [selectedBranch]);

  // --------------------------------------------------------------------------
  // USER LOCATION MARKER HANDLER
  // --------------------------------------------------------------------------
  const updateUserLocationMarker = useCallback(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    const map = mapInstanceRef.current;

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Create and place new user location marker
    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
      icon: createUserIcon(),
      zIndexOffset: 1000,
    })
      .addTo(map)
      .bindPopup("You are here");

    // Only pan to user if no branch is selected
    if (!selectedBranch) {
      map.setView([userLocation.lat, userLocation.lng], 12, { animate: true });
    }
  }, [userLocation, selectedBranch]);

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
  // CLEANUP — destroy map on unmount to prevent memory leaks
  // --------------------------------------------------------------------------
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------
  return (
    <div className='relative w-full h-full rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(10,22,40,0.12)]'>
      <div ref={mapRef} className='w-full h-full' />

      {/* Legend */}
      <div className='absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md flex flex-col gap-1.5 z-[1000]'>
        <div className='flex items-center gap-2 text-[11px] text-slate'>
          <div className='w-3.5 h-3.5 bg-midnight border-2 border-gold rounded-full' />
          <span>Branch</span>
        </div>
        <div className='flex items-center gap-2 text-[11px] text-slate'>
          <div className='w-3.5 h-3.5 bg-gold border-2 border-midnight rounded-full' />
          <span>Selected</span>
        </div>
        {userLocation && (
          <div className='flex items-center gap-2 text-[11px] text-slate'>
            <div className='w-3.5 h-3.5 bg-teal border-2 border-white rounded-full' />
            <span>You</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
