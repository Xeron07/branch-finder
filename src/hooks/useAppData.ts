import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { fetchBranches, filterBranches, distanceKm } from "../api/api";
import type { Branch, UserLocation, SortBy } from "../types";

export function useAppData() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [activeCities, setActiveCities] = useState<string[]>([]);
  const [activeCountries, setActiveCountries] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortDescending, setSortDescending] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locating, setLocating] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [mobileTab, setMobileTab] = useState<"list" | "map">("list");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [mobileDrawerBranch, setMobileDrawerBranch] = useState<Branch | null>(
    null,
  );

  // Track previous sortBy to detect changes
  const prevSortByRef = useRef<SortBy>("name");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBranches();
      setBranches(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load branch data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setSortBy("distance");
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10000 },
    );
  }, [setSortBy]);

  const handleCityToggle = useCallback((city: string) => {
    setActiveCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city],
    );
  }, []);

  const handleCountryToggle = useCallback((country: string) => {
    setActiveCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country],
    );
  }, []);

  const filteredBranches = useMemo(() => {
    // Filter by search query using client-side filter
    let result = filterBranches(branches, query);

    // Calculate distances for all filtered branches
    result = result.map((b) => ({
      ...b,
      distance:
        userLocation && b.lat && b.lng
          ? distanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng)
          : null,
    }));

    // Apply city filters
    if (activeCities.length > 0) {
      result = result.filter((b) => activeCities.includes(b.city));
    }

    // Apply country filters
    if (activeCountries.length > 0) {
      result = result.filter((b) => activeCountries.includes(b.country));
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "distance" && a.distance != null && b.distance != null)
        return a.distance - b.distance;
      if (sortBy === "city") {
        const comparison = (a.city || "").localeCompare(b.city || "");
        return sortDescending ? -comparison : comparison;
      }
      const comparison = (a.name || "").localeCompare(b.name || "");
      return sortDescending ? -comparison : comparison;
    });

    return result;
  }, [branches, query, activeCities, activeCountries, sortBy, sortDescending, userLocation]);

  const uniqueCities = useMemo(() => {
    const cities = new Set(branches.map((b) => b.city).filter(Boolean));
    return Array.from(cities).sort();
  }, [branches]);

  const uniqueCountries = useMemo(() => {
    const countries = new Set(branches.map((b) => b.country).filter(Boolean));
    return Array.from(countries).sort();
  }, [branches]);

  const clearAll = useCallback(() => {
    setQuery("");
    setActiveCities([]);
    setActiveCountries([]);
  }, []);

  const handleMobileMapSelect = useCallback((b: Branch) => {
    setSelectedBranch(b);
  }, []);

  const handleOpenDrawer = useCallback((branch: Branch) => {
    setMobileDrawerBranch(branch);
    setSelectedBranch(branch);
    setMobileDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setMobileDrawerOpen(false);
  }, []);

  // Auto-select first branch when filtered list changes
  useEffect(() => {
    if (filteredBranches.length > 0) {
      const needsSelection =
        !selectedBranch ||
        !filteredBranches.find((b) => b.id === selectedBranch.id) ||
        prevSortByRef.current !== sortBy;

      if (needsSelection) {
        setSelectedBranch(filteredBranches[0]);
      }

      // Update ref for next comparison
      prevSortByRef.current = sortBy;
    } else {
      setSelectedBranch(null);
    }
  }, [filteredBranches, selectedBranch, sortBy]);

  return {
    // State
    branches,
    loading,
    error,
    query,
    setQuery,
    activeCities,
    activeCountries,
    sortBy,
    setSortBy,
    sortDescending,
    setSortDescending,
    userLocation,
    locating,
    selectedBranch,
    setSelectedBranch,
    mobileTab,
    setMobileTab,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    mobileDrawerBranch,
    setMobileDrawerBranch,
    // Computed
    filteredBranches,
    uniqueCities,
    uniqueCountries,
    // Actions
    load,
    handleGeolocate,
    handleCityToggle,
    handleCountryToggle,
    clearAll,
    handleMobileMapSelect,
    handleOpenDrawer,
    handleCloseDrawer,
  };
}
