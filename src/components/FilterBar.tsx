import SearchableSelect from "./SearchableSelect";
import { BuildingIcon, GlobeIcon } from "./icons/IconLibrary";

interface FilterBarProps {
  cities: string[];
  activeCity: string | null;
  onCityChange: (city: string | null) => void;
  countries: string[];
  activeCountry: string | null;
  onCountryChange: (country: string | null) => void;
}

export default function FilterBar({
  cities,
  activeCity,
  onCityChange,
  countries,
  activeCountry,
  onCountryChange,
}: FilterBarProps) {
  // City icon - building/location icon
  const cityIcon = <BuildingIcon size={20} />;

  // Country icon - flag icon
  const countryIcon = <GlobeIcon size={20} />;

  // Add "All" option to dropdown lists
  const countryOptions = ["All", ...countries];
  const cityOptions = ["All", ...cities];

  return (
    <div className='grid grid-cols-2 gap-3 w-full sm:bg-white sm:px-3 sm:py-2 sm:rounded-xl sm:shadow-[0_2px_8px_rgba(10,22,40,0.08)] sm:hover:shadow-[0_4px_16px_rgba(10,22,40,0.12)]'>
      {/* Country filter dropdown */}
      <div className='w-full'>
        <SearchableSelect
          options={countryOptions}
          value={activeCountry || ""}
          onChange={(newValue) => {
            const finalValue = newValue === "All" ? null : (newValue || null);
            onCountryChange(finalValue);
          }}
          placeholder='All countries'
          label='Country'
          multiSelect={false}
          className='w-full'
          icon={countryIcon}
        />
      </div>

      {/* City filter dropdown */}
      <div className='w-full'>
        <SearchableSelect
          options={cityOptions}
          value={activeCity || ""}
          onChange={(newValue) => {
            const finalValue = newValue === "All" ? null : (newValue || null);
            onCityChange(finalValue);
          }}
          placeholder='All cities'
          label='City'
          multiSelect={false}
          className='w-full'
          icon={cityIcon}
        />
      </div>
    </div>
  );
}
