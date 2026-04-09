import { UnifiedHero } from "./UnifiedHero";
import { BranchListContent } from "./BranchListContent";
import { DesktopBranchLayout } from "./DesktopBranchLayout";
import { MobileBranchLayout } from "./MobileBranchLayout";
import { ErrorState } from "./ErrorState";
import BranchDrawer from "../BranchDrawer";
import { useAppData } from "../../hooks/useAppData";
import type { Branch } from "../../types";
import type { SelectionSource } from "../../types";
import { useState, useRef } from "react";

// ============================================================================
// BRANCH FINDER COMPONENT
// ============================================================================

const BranchFinder = () => {
  const appData = useAppData();

  // Track where the selection came from (map, list, or drawer)
  const [selectionSource, setSelectionSource] = useState<SelectionSource | undefined>();

  // Refs for scroll containers
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  // Handler for list-based selection (no scroll)
  const handleListSelect = (b: Branch) => {
    setSelectionSource('list');
    appData.setSelectedBranch((prev) => (prev?.id === b.id ? null : b));
  };

  // Handler for map-based selection (with scroll)
  const handleMapSelect = (b: Branch) => {
    setSelectionSource('map');
    appData.setSelectedBranch(b);
  };

  // --------------------------------------------------------------------------
  // LIST CONTENT RENDERERS
  // --------------------------------------------------------------------------

  const listContent = (
    <BranchListContent
      loading={appData.loading}
      branches={appData.filteredBranches}
      query={appData.query}
      onClear={appData.clearAll}
      onBranchSelect={handleListSelect}
      selectedBranch={appData.selectedBranch}
      mobileMode={false}
      selectionSource={selectionSource}
      scrollContainerRef={desktopScrollRef}
    />
  );

  const mobileListContent = (
    <BranchListContent
      loading={appData.loading}
      branches={appData.filteredBranches}
      query={appData.query}
      onClear={appData.clearAll}
      onBranchSelect={handleListSelect}
      selectedBranch={appData.selectedBranch}
      mobileMode={true}
      onOpenDrawer={appData.handleOpenDrawer}
      selectionSource={selectionSource}
      scrollContainerRef={mobileScrollRef}
    />
  );

  // --------------------------------------------------------------------------
  // LAYOUT PROPS
  // --------------------------------------------------------------------------

  const desktopLayoutProps = {
    listContent,
    mapProps: {
      branches: appData.filteredBranches,
      selectedBranch: appData.selectedBranch,
      onSelectBranch: handleMapSelect,
      userLocation: appData.userLocation,
    },
    filterProps: {
      cities: appData.availableCities,
      activeCity: appData.activeCity,
      onCityChange: appData.handleCityChange,
      countries: appData.uniqueCountries,
      activeCountry: appData.activeCountry,
      onCountryChange: appData.handleCountryChange,
    },
    searchProps: {
      value: appData.query,
      onChange: appData.setQuery,
      onGeolocate: appData.handleGeolocate,
      locating: appData.locating,
    },
    branchCountProps: {
      total: appData.branches.length,
      sortBy: appData.sortBy,
      sortDescending: appData.sortDescending,
      onSortByChange: appData.setSortBy,
      onSortDirectionChange: appData.setSortDescending,
    },
    scrollContainerRef: desktopScrollRef,
  };

  const mobileLayoutProps = {
    listContent: mobileListContent,
    filterProps: {
      cities: appData.availableCities,
      activeCity: appData.activeCity,
      onCityChange: appData.handleCityChange,
      countries: appData.uniqueCountries,
      activeCountry: appData.activeCountry,
      onCountryChange: appData.handleCountryChange,
    },
    branchCountProps: {
      total: appData.branches.length,
      sortBy: appData.sortBy,
      sortDescending: appData.sortDescending,
      onSortByChange: appData.setSortBy,
      onSortDirectionChange: appData.setSortDescending,
    },
    filteredBranchesCount: appData.filteredBranches.length,
    scrollContainerRef: mobileScrollRef,
  };

  // --------------------------------------------------------------------------
  // MAIN RENDER
  // --------------------------------------------------------------------------

  return (
    <>
      {/* Hero Section */}
      <UnifiedHero
        showSearch={true}
        value={appData.query}
        onChange={appData.setQuery}
        onGeolocate={appData.handleGeolocate}
        locating={appData.locating}
      />

      {/* Global Error State */}
      {appData.error ? (
        <div className='max-w-md mx-auto py-20 px-4'>
          <ErrorState message={appData.error} onRetry={appData.load} />
        </div>
      ) : (
        <>
          {/* Desktop Layout */}
          <div className='hidden md:flex'>
            <DesktopBranchLayout {...desktopLayoutProps} />
          </div>

          {/* Mobile Layout */}
          <div className='md:hidden'>
            <MobileBranchLayout {...mobileLayoutProps} />
          </div>
        </>
      )}

      {/* Mobile Branch Drawer */}
      <BranchDrawer
        branch={appData.mobileDrawerBranchRef.current}
        isOpen={appData.mobileDrawerOpen}
        onClose={appData.handleCloseDrawer}
        branches={appData.filteredBranches}
        selectedBranch={appData.selectedBranch}
        onSelectBranch={appData.setSelectedBranch}
        userLocation={appData.userLocation}
      />
    </>
  );
};

export default BranchFinder;
