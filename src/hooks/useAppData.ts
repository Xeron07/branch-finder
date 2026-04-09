import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { fetchBranches, filterBranches, distanceKm } from "../api/api";
import type { Branch, UserLocation, SortBy } from "../types";

export function useAppData() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortDescending, setSortDescending] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locating, setLocating] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  const prevSortByRef = useRef<SortBy>("name");
  const mobileDrawerBranchRef = useRef<Branch | null>(null);

  // ── Data fetching ─────────────────────────────────────────────────────────

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

  // ── Geolocation ───────────────────────────────────────────────────────────

  const handleGeolocate = () => {
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
  };

  // ── Filter actions ────────────────────────────────────────────────────────

  const handleCityChange = (city: string | null) => {
    setActiveCity(city);
  };

  const handleCountryChange = (country: string | null) => {
    setActiveCountry(country);
    // Reset city if it's not in the selected country's cities
    if (country && activeCity) {
      const citiesInCountry = branches
        .filter((b) => b.country === country)
        .map((b) => b.city);
      if (!citiesInCountry.includes(activeCity)) {
        setActiveCity(null);
      }
    }
  };

  const clearAll = () => {
    setQuery("");
    setActiveCity(null);
    setActiveCountry(null);
  };

  // ── Drawer ────────────────────────────────────────────────────────────────

  const handleOpenDrawer = (branch: Branch) => {
    mobileDrawerBranchRef.current = branch;
    setSelectedBranch(branch);
    setMobileDrawerOpen(true);
  };

  const handleCloseDrawer = () => setMobileDrawerOpen(false);

  const handleMobileMapSelect = (b: Branch) => setSelectedBranch(b);

  // ── Derived data ──────────────────────────────────────────────────────────

  const filteredBranches = useMemo(() => {
    let result = filterBranches(branches, query);

    result = result.map((b) => ({
      ...b,
      distance:
        userLocation && b.lat && b.lng
          ? distanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng)
          : null,
    }));

    if (activeCity) {
      result = result.filter((b) => b.city === activeCity);
    }

    if (activeCountry) {
      result = result.filter((b) => b.country === activeCountry);
    }

    result.sort((a, b) => {
      if (sortBy === "distance" && a.distance != null && b.distance != null) {
        return a.distance - b.distance;
      }
      if (sortBy === "city") {
        const cmp = (a.city || "").localeCompare(b.city || "");
        return sortDescending ? -cmp : cmp;
      }
      const cmp = (a.name || "").localeCompare(b.name || "");
      return sortDescending ? -cmp : cmp;
    });

    return result;
  }, [
    branches,
    query,
    activeCity,
    activeCountry,
    sortBy,
    sortDescending,
    userLocation,
  ]);

  const uniqueCities = useMemo(
    () =>
      Array.from(new Set(branches.map((b) => b.city).filter(Boolean))).sort(),
    [branches],
  );

  const uniqueCountries = useMemo(
    () =>
      Array.from(
        new Set(branches.map((b) => b.country).filter(Boolean)),
      ).sort(),
    [branches],
  );

  // Create city-country mapping for dependent filtering
  const citiesByCountry = useMemo(() => {
    const mapping: Record<string, string[]> = {};
    branches.forEach((branch) => {
      if (branch.country && branch.city) {
        if (!mapping[branch.country]) {
          mapping[branch.country] = [];
        }
        if (!mapping[branch.country].includes(branch.city)) {
          mapping[branch.country].push(branch.city);
        }
      }
    });
    // Sort cities in each country
    Object.keys(mapping).forEach((country) => {
      mapping[country].sort();
    });
    return mapping;
  }, [branches]);

  // Get available cities based on selected country (or all cities if no country selected)
  const availableCities = useMemo(() => {
    if (activeCountry) {
      return citiesByCountry[activeCountry] || [];
    }
    return uniqueCities;
  }, [activeCountry, citiesByCountry, uniqueCities]);

  // ── Auto-select first branch ──────────────────────────────────────────────

  useEffect(() => {
    if (filteredBranches.length === 0) {
      setSelectedBranch(null);
      return;
    }

    const sortChanged = prevSortByRef.current !== sortBy;
    prevSortByRef.current = sortBy;

    const currentIsGone = !filteredBranches.find(
      (b) => b.id === selectedBranch?.id,
    );

    if (!selectedBranch || currentIsGone || sortChanged) {
      setSelectedBranch(filteredBranches[0]);
    }
  }, [filteredBranches, sortBy]);

  // ── Return ────────────────────────────────────────────────────────────────

  return {
    branches,
    loading,
    error,
    query,
    setQuery,
    activeCity,
    activeCountry,
    sortBy,
    setSortBy,
    sortDescending,
    setSortDescending,
    userLocation,
    locating,
    selectedBranch,
    setSelectedBranch,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    mobileDrawerBranchRef,
    filteredBranches,
    uniqueCities,
    uniqueCountries,
    availableCities,
    load,
    handleGeolocate,
    handleCityChange,
    handleCountryChange,
    clearAll,
    handleMobileMapSelect,
    handleOpenDrawer,
    handleCloseDrawer,
  };
}
