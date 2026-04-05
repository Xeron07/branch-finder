import SearchBar from "../SearchBar";
import FilterBar from "../FilterBar";

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onGeolocate: () => void;
  locating: boolean;
  cities: string[];
  activeCities: string[];
  onCityToggle: (city: string) => void;
  countries: string[];
  activeCountries: string[];
  onCountryToggle: (country: string) => void;
}

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  onGeolocate,
  locating,
  cities,
  activeCities,
  onCityToggle,
  countries,
  activeCountries,
  onCountryToggle,
}: SearchFilterBarProps) {
  return (
    <div className='relative z-30 bg-cream rounded-2xl -mt-16 shadow-[0_2px_12px_rgba(10,22,40,0.08)] sm:shadow p-3 gap-8 flex justify-between items-center'>
      {/* Search Bar */}
      <div className='w-[55%] sm:w-[60.5%]'>
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onGeolocate={onGeolocate}
          locating={locating}
        />
      </div>

      {/* Filter Bar */}
      <div className='w-full flex-1 flex pr-2.5'>
        <FilterBar
          cities={cities}
          activeCities={activeCities}
          onCityToggle={onCityToggle}
          countries={countries}
          activeCountries={activeCountries}
          onCountryToggle={onCountryToggle}
        />
      </div>
    </div>
  );
}
