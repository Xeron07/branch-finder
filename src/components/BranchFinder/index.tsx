import { UnifiedHero } from "./UnifiedHero";
import { BranchListContent } from "./BranchListContent";
import { DesktopBranchLayout } from "./DesktopBranchLayout";
import { MobileBranchLayout } from "./MobileBranchLayout";
import { ErrorState } from "./ErrorState";
import BranchDrawer from "../BranchDrawer";
import { useAppData } from "../../hooks/useAppData";

// ============================================================================
// BRANCH FINDER COMPONENT
// ============================================================================

const BranchFinder = () => {
  const appData = useAppData();

  // --------------------------------------------------------------------------
  // LIST CONTENT RENDERERS
  // --------------------------------------------------------------------------

  const listContent = (
    <BranchListContent
      loading={appData.loading}
      branches={appData.filteredBranches}
      query={appData.query}
      onClear={appData.clearAll}
      onBranchSelect={(b) =>
        appData.setSelectedBranch((prev) => (prev?.id === b.id ? null : b))
      }
      selectedBranch={appData.selectedBranch}
      mobileMode={false}
    />
  );

  const mobileListContent = (
    <BranchListContent
      loading={appData.loading}
      branches={appData.filteredBranches}
      query={appData.query}
      onClear={appData.clearAll}
      onBranchSelect={(b) =>
        appData.setSelectedBranch((prev) => (prev?.id === b.id ? null : b))
      }
      selectedBranch={appData.selectedBranch}
      mobileMode={true}
      onOpenDrawer={appData.handleOpenDrawer}
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
      onSelectBranch: appData.setSelectedBranch,
      userLocation: appData.userLocation,
    },
    filterProps: {
      cities: appData.uniqueCities,
      activeCities: appData.activeCities,
      onCityToggle: appData.handleCityToggle,
      countries: appData.uniqueCountries,
      activeCountries: appData.activeCountries,
      onCountryToggle: appData.handleCountryToggle,
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
  };

  const mobileLayoutProps = {
    listContent: mobileListContent,
    filterProps: {
      cities: appData.uniqueCities,
      activeCities: appData.activeCities,
      onCityToggle: appData.handleCityToggle,
      countries: appData.uniqueCountries,
      activeCountries: appData.activeCountries,
      onCountryToggle: appData.handleCountryToggle,
    },
    branchCountProps: {
      total: appData.branches.length,
      sortBy: appData.sortBy,
      sortDescending: appData.sortDescending,
      onSortByChange: appData.setSortBy,
      onSortDirectionChange: appData.setSortDescending,
    },
    filteredBranchesCount: appData.filteredBranches.length,
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
