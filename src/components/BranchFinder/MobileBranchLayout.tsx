import FilterBar from "../FilterBar";
import { BranchCountHeader } from "../BranchCountHeader";
import type { SortBy } from "../../types";
import type { ReactNode } from "react";

interface MobileBranchLayoutProps {
  listContent: ReactNode;
  filterProps: {
    cities: string[];
    activeCities: string[];
    onCityToggle: (city: string) => void;
    countries: string[];
    activeCountries: string[];
    onCountryToggle: (country: string) => void;
  };
  branchCountProps: {
    total: number;
    sortBy: SortBy;
    sortDescending: boolean;
    onSortByChange: (sortBy: SortBy) => void;
    onSortDirectionChange: (descending: boolean) => void;
  };
  filteredBranchesCount: number;
}

export function MobileBranchLayout({
  listContent,
  filterProps,
  branchCountProps,
  filteredBranchesCount,
}: MobileBranchLayoutProps) {
  return (
    <div className='flex flex-col flex-1 relative bg-warmWhite'>
      {/* Filter bar - sticky below hero */}
      <div className='sticky top-0 z-30 bg-white shadow-[0_2px_12px_rgba(10,22,40,0.08)] px-4 py-3'>
        <FilterBar
          cities={filterProps.cities}
          activeCities={filterProps.activeCities}
          onCityToggle={filterProps.onCityToggle}
          countries={filterProps.countries}
          activeCountries={filterProps.activeCountries}
          onCountryToggle={filterProps.onCountryToggle}
        />
      </div>

      {/* Branch List */}
      <div className='flex flex-col flex-1'>
        {/* Branch count header */}
        {filteredBranchesCount > 0 && (
          <div className='px-4 pt-3 pb-2'>
            <BranchCountHeader
              count={filteredBranchesCount}
              total={branchCountProps.total}
              sortBy={branchCountProps.sortBy}
              sortDescending={branchCountProps.sortDescending}
              userLocation={null}
              onSortByChange={branchCountProps.onSortByChange}
              onSortDirectionChange={branchCountProps.onSortDirectionChange}
            />
          </div>
        )}

        {/* Branch list */}
        <div className='flex-1 px-1 sm:px-4 pb-24 space-y-2 overflow-y-auto'>
          {listContent}
        </div>
      </div>
    </div>
  );
}
