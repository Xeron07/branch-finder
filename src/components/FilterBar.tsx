import SearchableSelect from "./SearchableSelect";

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
  const cityIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      stroke-width='2'
      stroke-linecap='round'
      stroke-linejoin='round'
      className='lucide lucide-building2-icon lucide-building-2'>
      <path d='M10 12h4' />
      <path d='M10 8h4' />
      <path d='M14 21v-3a2 2 0 0 0-4 0v3' />
      <path d='M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2' />
      <path d='M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16' />
    </svg>
  );

  // Country icon - flag icon
  const countryIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      stroke-width='2'
      stroke-linecap='round'
      stroke-linejoin='round'
      className='lucide lucide-earth-icon lucide-earth'>
      <path d='M21.54 15H17a2 2 0 0 0-2 2v4.54' />
      <path d='M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17' />
      <path d='M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05' />
      <circle cx='12' cy='12' r='10' />
    </svg>
  );

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
