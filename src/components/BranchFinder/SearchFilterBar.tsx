import SearchBar from "../SearchBar";
import FilterBar from "../FilterBar";

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onGeolocate: () => void;
  locating: boolean;
  cities: string[];
  activeCity: string | null;
  onCityChange: (city: string | null) => void;
  countries: string[];
  activeCountry: string | null;
  onCountryChange: (country: string | null) => void;
}

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  onGeolocate,
  locating,
  cities,
  activeCity,
  onCityChange,
  countries,
  activeCountry,
  onCountryChange,
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
          activeCity={activeCity}
          onCityChange={onCityChange}
          countries={countries}
          activeCountry={activeCountry}
          onCountryChange={onCountryChange}
        />
      </div>
    </div>
  );
}
