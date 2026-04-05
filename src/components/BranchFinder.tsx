import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import BranchCard from "./BranchCard";
import SkeletonCards from "./SkeletonCards";
import MapView from "./MapView";
import BranchDrawer from "./BranchDrawer";
import { BranchCountHeader } from "./BranchCountHeader";
import { EmptyState } from "./BranchFinder/EmptyState";
import { ErrorState } from "./BranchFinder/ErrorState";
import { useAppData } from "../hooks/useAppData";

// ============================================================================
// TYPES
// ============================================================================

// ============================================================================
// HERO COMPONENT
// ============================================================================

export const Hero = () => {
  return (
    <div className='relative bg-gradient-to-br from-midnight via-midnight to-teal pt-20 pb-8 sm:pt-36 sm:pb-32 px-4'>
      <div className='max-w-4xl mx-auto text-center'>
        <p className='text-sage text-[12px] uppercase tracking-[4px] font-medium mb-3'>
          Brightstream Bank
        </p>
        <h1 className='font-playfair text-3xl sm:text-5xl font-bold text-warmWhite leading-tight tracking-tight'>
          Find Your Nearest <span className='text-gold'>Branch</span>
        </h1>
        <p className='text-cream/70 font-light text-base mt-3 max-w-md mx-auto'>
          100 branches worldwide — search by name, city or postcode.
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// HERO COMPONENT WITH SEARCH (MOBILE ONLY)
// ============================================================================

interface HeroWithSearchProps {
  value: string;
  onChange: (value: string) => void;
  onGeolocate: () => void;
  locating: boolean;
}

export const HeroWithSearch = ({
  value,
  onChange,
  onGeolocate,
  locating,
}: HeroWithSearchProps) => {
  return (
    <div className='relative bg-gradient-to-br from-midnight via-midnight to-teal pt-20 pb-8 sm:pt-36 sm:pb-32 px-4'>
      <div className='max-w-4xl mx-auto text-center mb-6'>
        <p className='text-sage text-[12px] uppercase tracking-[4px] font-medium mb-3'>
          Brightstream Bank
        </p>
        <h1 className='font-playfair text-3xl sm:text-5xl font-bold text-warmWhite leading-tight tracking-tight'>
          Find Your Nearest <span className='text-gold'>Branch</span>
        </h1>
        <p className='text-cream/70 font-light text-base mt-3 max-w-md mx-auto'>
          100 branches worldwide — search by name, city or postcode.
        </p>
      </div>

      {/* Search bar - mobile only */}
      <div className='md:hidden max-w-2xl mx-auto px-4'>
        <SearchBar
          value={value}
          onChange={onChange}
          onGeolocate={onGeolocate}
          locating={locating}
        />
      </div>
    </div>
  );
};

// ============================================================================
// BRANCH FINDER COMPONENT
// ============================================================================

const BranchFinder = () => {
  const appData = useAppData();

  // --------------------------------------------------------------------------
  // LIST CONTENT RENDERER
  // --------------------------------------------------------------------------

  const listContent = appData.loading ? (
    <SkeletonCards count={6} />
  ) : appData.filteredBranches.length === 0 ? (
    <EmptyState query={appData.query} onClear={appData.clearAll} />
  ) : (
    <>
      {appData.filteredBranches.map((branch, i) => (
        <BranchCard
          key={branch.id}
          branch={branch}
          index={i}
          onSelect={(b) =>
            appData.setSelectedBranch((prev) => (prev?.id === b.id ? null : b))
          }
          isSelected={appData.selectedBranch?.id === branch.id}
        />
      ))}
    </>
  );

  // Mobile list content with drawer functionality
  const mobileListContent = appData.loading ? (
    <SkeletonCards count={6} />
  ) : appData.filteredBranches.length === 0 ? (
    <EmptyState query={appData.query} onClear={appData.clearAll} />
  ) : (
    <>
      {appData.filteredBranches.map((branch, i) => (
        <BranchCard
          key={branch.id}
          branch={branch}
          index={i}
          onSelect={(b) =>
            appData.setSelectedBranch((prev) => (prev?.id === b.id ? null : b))
          }
          isSelected={appData.selectedBranch?.id === branch.id}
          onOpenDrawer={appData.handleOpenDrawer}
        />
      ))}
    </>
  );

  // --------------------------------------------------------------------------
  // MAIN RENDER
  // --------------------------------------------------------------------------

  return (
    <>
      {/* Hero Section - with Search on mobile */}
      <div className='md:hidden'>
        <HeroWithSearch
          value={appData.query}
          onChange={appData.setQuery}
          onGeolocate={appData.handleGeolocate}
          locating={appData.locating}
        />
      </div>
      <div className='hidden md:block'>
        <Hero />
      </div>

      {/* Global Error State */}
      {appData.error ? (
        <div className='max-w-md mx-auto py-20 px-4'>
          <ErrorState message={appData.error} onRetry={appData.load} />
        </div>
      ) : (
        <>
          {/* ── DESKTOP LAYOUT (md+) ─────────────────────────────────────── */}
          <div className='hidden md:flex flex-col flex-1 max-w-7xl w-full mx-auto px-6 py-6 gap-4'>
            {/* Unified Search and Filter Bar */}
            <div className='z-30  bg-cream rounded-2xl mt-[-65px] shadow-[0_2px_12px_rgba(10,22,40,0.08)] sm:shadow p-4 gap-8 flex justify-between items-center'>
              {/* Search bar - full width */}
              <div className='w-[55%] xl:w-[60%]'>
                <SearchBar
                  value={appData.query}
                  onChange={appData.setQuery}
                  onGeolocate={appData.handleGeolocate}
                  locating={appData.locating}
                />
              </div>

              {/* Filter bar */}
              <div className='w-full flex-1 flex'>
                <FilterBar
                  cities={appData.uniqueCities}
                  activeCities={appData.activeCities}
                  onCityToggle={appData.handleCityToggle}
                  countries={appData.uniqueCountries}
                  activeCountries={appData.activeCountries}
                  onCountryToggle={appData.handleCountryToggle}
                />
              </div>
            </div>

            {/* Split Pane: Map + List */}
            <div className='flex flex-1 gap-6 min-h-0'>
              {/* Left: Map */}
              <div
                className='sticky top-20 self-start w-[35%] sm:w-[45%] xl:w-[60%] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(10,22,40,0.12)]'
                style={{ height: "calc(100vh - 220px)" }}>
                <MapView
                  branches={appData.filteredBranches}
                  selectedBranch={appData.selectedBranch}
                  onSelectBranch={appData.setSelectedBranch}
                  userLocation={appData.userLocation}
                />
              </div>

              {/* Right: Branch Count + List */}
              <div className='flex-1 flex flex-col min-w-0'>
                {/* Branch count header */}
                {!appData.loading && appData.filteredBranches.length > 0 && (
                  <BranchCountHeader
                    count={appData.filteredBranches.length}
                    total={appData.branches.length}
                    sortBy={appData.sortBy}
                    sortDescending={appData.sortDescending}
                    userLocation={appData.userLocation}
                    onSortByChange={appData.setSortBy}
                    onSortDirectionChange={appData.setSortDescending}
                  />
                )}

                {/* Branch list */}
                <div
                  className='flex-1 overflow-y-auto space-y-2 pr-1'
                  style={{ maxHeight: "calc(100vh - 280px)" }}>
                  {listContent}
                </div>
              </div>
            </div>
          </div>

          {/* ── MOBILE LAYOUT (<md) ─────────────────────────────────────── */}
          <div className='md:hidden flex flex-col flex-1 relative bg-warmWhite'>
            {/* Filter bar - sticky below hero */}
            <div className='sticky top-0 z-30 bg-white shadow-[0_2px_12px_rgba(10,22,40,0.08)] px-4 py-3'>
              <FilterBar
                cities={appData.uniqueCities}
                activeCities={appData.activeCities}
                onCityToggle={appData.handleCityToggle}
                countries={appData.uniqueCountries}
                activeCountries={appData.activeCountries}
                onCountryToggle={appData.handleCountryToggle}
              />
            </div>

            {/* List View */}
            {appData.mobileTab === "list" && (
              <div className='flex flex-col flex-1'>
                {/* Branch count header */}
                {!appData.loading && appData.filteredBranches.length > 0 && (
                  <div className='px-4 pt-3 pb-2'>
                    <BranchCountHeader
                      count={appData.filteredBranches.length}
                      total={appData.branches.length}
                      sortBy={appData.sortBy}
                      sortDescending={appData.sortDescending}
                      userLocation={appData.userLocation}
                      onSortByChange={appData.setSortBy}
                      onSortDirectionChange={appData.setSortDescending}
                    />
                  </div>
                )}

                {/* Branch list */}
                <div className='flex-1 sm:px-4 pb-24 space-y-2 overflow-y-auto'>
                  {mobileListContent}
                </div>
              </div>
            )}

            {/* Map View */}
            {appData.mobileTab === "map" && (
              <div className='relative h-[calc(100vh-140px)]'>
                <MapView
                  branches={appData.filteredBranches}
                  selectedBranch={appData.selectedBranch}
                  onSelectBranch={appData.handleMobileMapSelect}
                  userLocation={appData.userLocation}
                />

                {/* Back to List Button */}
                <button
                  onClick={() => appData.setMobileTab("list")}
                  className='absolute top-4 left-4 z-[1000] flex items-center gap-2 px-4 py-2.5 bg-white text-midnight rounded-full text-[13px] font-medium shadow-[0_4px_16px_rgba(10,22,40,0.2)] hover:bg-midnight hover:text-warmWhite transition-all duration-200 active:scale-95'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2.5}>
                    <path
                      d='M15 19l-7-7 7-7'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <span>List</span>
                  <span className='bg-cream text-midnight text-[11px] px-2 py-0.5 rounded-full font-semibold'>
                    {appData.filteredBranches.length}
                  </span>
                </button>

                {/* Selected Branch Mini Card */}
                {appData.selectedBranch && !appData.mobileDrawerOpen && (
                  <div className='absolute bottom-4 left-4 right-4 z-[1000]'>
                    <div
                      className='bg-white rounded-2xl shadow-[0_8px_32px_rgba(10,22,40,0.18)] px-4 py-3.5 flex items-center gap-3 cursor-pointer border-2 border-gold active:scale-[0.98] transition-transform'
                      onClick={() =>
                        appData.handleOpenDrawer(appData.selectedBranch!)
                      }>
                      <div className='flex-1 min-w-0'>
                        <p className='font-playfair font-semibold text-midnight text-[15px] truncate'>
                          {appData.selectedBranch.name}
                        </p>
                        <p className='text-[12px] text-slate font-normal mt-0.5 truncate'>
                          {[
                            appData.selectedBranch.address,
                            appData.selectedBranch.city,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <div className='flex items-center gap-1.5 shrink-0 text-gold text-[13px] font-medium'>
                        View
                        <svg
                          className='w-3.5 h-3.5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          strokeWidth={2.5}>
                          <path
                            d='M9 5l7 7-7 7'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Mobile Branch Drawer */}
      <BranchDrawer
        branch={appData.mobileDrawerBranch}
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
