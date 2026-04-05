import SearchableSelect from "./SearchableSelect";
import { BuildingIcon, GlobeIcon } from "../components/icons/IconLibrary";

interface FilterBarProps {
  cities: string[];
  activeCities: string[];
  onCityToggle: (city: string) => void;
  countries: string[];
  activeCountries: string[];
  onCountryToggle: (country: string) => void;
}

export default function FilterBar({
  cities,
  activeCities,
  onCityToggle,
  countries,
  activeCountries,
  onCountryToggle,
}: FilterBarProps) {
  // City icon - building/location icon
  const cityIcon = <BuildingIcon size={20} />;

  // Country icon - flag icon
  const countryIcon = <GlobeIcon size={20} />;

  return (
    <div className='grid grid-cols-2 gap-3 w-full sm:bg-white sm:px-3 sm:py-2 sm:rounded-xl sm:shadow-[0_2px_8px_rgba(10,22,40,0.08)] sm:hover:shadow-[0_4px_16px_rgba(10,22,40,0.12)]'>
      {/* City filter dropdown */}
      <div className='w-full'>
        <SearchableSelect
          options={cities}
          value={activeCities}
          onChange={(newValue) => {
            activeCities.forEach((city) => {
              if (!newValue.includes(city)) onCityToggle(city);
            });
            const newCities = Array.isArray(newValue) ? newValue : [newValue];
            newCities.forEach((city) => {
              if (!activeCities.includes(city)) onCityToggle(city);
            });
          }}
          placeholder='All cities'
          label='City'
          multiSelect={true}
          className='w-full'
          icon={cityIcon}
        />
      </div>

      {/* Country filter dropdown */}
      <div className='w-full'>
        <SearchableSelect
          options={countries}
          value={activeCountries}
          onChange={(newValue) => {
            activeCountries.forEach((country) => {
              if (!newValue.includes(country)) onCountryToggle(country);
            });
            const newCountries = Array.isArray(newValue)
              ? newValue
              : [newValue];
            newCountries.forEach((country) => {
              if (!activeCountries.includes(country)) onCountryToggle(country);
            });
          }}
          placeholder='All countries'
          label='Country'
          multiSelect={true}
          className='w-full'
          icon={countryIcon}
        />
      </div>
    </div>
  );
}
