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

  const handleCityToggle = (city: string) => {
    setActiveCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city],
    );
  };

  const handleCountryToggle = (country: string) => {
    setActiveCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country],
    );
  };

  const clearAll = () => {
    setQuery("");
    setActiveCities([]);
    setActiveCountries([]);
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

    if (activeCities.length > 0) {
      result = result.filter((b) => activeCities.includes(b.city));
    }

    if (activeCountries.length > 0) {
      result = result.filter((b) => activeCountries.includes(b.country));
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
    activeCities,
    activeCountries,
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
    mobileDrawerOpen,
    setMobileDrawerOpen,
    mobileDrawerBranchRef,
    filteredBranches,
    uniqueCities,
    uniqueCountries,
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
