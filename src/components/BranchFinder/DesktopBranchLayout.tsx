import MapView from "../MapView";
import { BranchCountHeader } from "../BranchCountHeader";
import { SearchFilterBar } from "./SearchFilterBar";
import type { Branch, UserLocation, SortBy } from "../../types";
import type { ReactNode } from "react";

interface DesktopBranchLayoutProps {
  listContent: ReactNode;
  mapProps: {
    branches: Branch[];
    selectedBranch: Branch | null;
    onSelectBranch: (branch: Branch) => void;
    userLocation: UserLocation | null;
  };
  filterProps: {
    cities: string[];
    activeCities: string[];
    onCityToggle: (city: string) => void;
    countries: string[];
    activeCountries: string[];
    onCountryToggle: (country: string) => void;
  };
  searchProps: {
    value: string;
    onChange: (value: string) => void;
    onGeolocate: () => void;
    locating: boolean;
  };
  branchCountProps: {
    total: number;
    sortBy: SortBy;
    sortDescending: boolean;
    onSortByChange: (sortBy: SortBy) => void;
    onSortDirectionChange: (descending: boolean) => void;
  };
}

export function DesktopBranchLayout({
  listContent,
  mapProps,
  filterProps,
  searchProps,
  branchCountProps,
}: DesktopBranchLayoutProps) {
  return (
    <div className='max-w-7xl md:flex flex-col flex-1 w-full mx-auto px-6 py-6 gap-4'>
      <SearchFilterBar
        searchValue={searchProps.value}
        onSearchChange={searchProps.onChange}
        onGeolocate={searchProps.onGeolocate}
        locating={searchProps.locating}
        cities={filterProps.cities}
        activeCities={filterProps.activeCities}
        onCityToggle={filterProps.onCityToggle}
        countries={filterProps.countries}
        activeCountries={filterProps.activeCountries}
        onCountryToggle={filterProps.onCountryToggle}
      />

      {/* Main content: map (fixed) + list (scrollable) */}
      <div className='flex gap-6 h-[calc(100vh-12rem)]'>
        {/* Left: Map (fixed) */}
        <div className='w-[55%] sm:w-[60.5%] shrink-0'>
          <div className='sticky top-0 h-[calc(100vh-12rem)] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(10,22,40,0.12)]'>
            <MapView
              branches={mapProps.branches}
              selectedBranch={mapProps.selectedBranch}
              onSelectBranch={mapProps.onSelectBranch}
              userLocation={mapProps.userLocation}
            />
          </div>
        </div>

        {/* Right: Branch List (scrollable) */}
        <div className='flex-1 overflow-y-auto pr-1 min-w-0'>
          <div className='mb-4'>
            <BranchCountHeader
              count={mapProps.branches.length}
              total={branchCountProps.total}
              sortBy={branchCountProps.sortBy}
              sortDescending={branchCountProps.sortDescending}
              userLocation={mapProps.userLocation}
              onSortByChange={branchCountProps.onSortByChange}
              onSortDirectionChange={branchCountProps.onSortDirectionChange}
            />
          </div>
          <div className='space-y-2'>{listContent}</div>
        </div>
      </div>
    </div>
  );
}
