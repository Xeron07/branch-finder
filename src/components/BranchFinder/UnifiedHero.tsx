import SearchBar from "../SearchBar";

interface UnifiedHeroProps {
  showSearch: boolean;
  value: string;
  onChange: (value: string) => void;
  onGeolocate: () => void;
  locating: boolean;
}

export function UnifiedHero({
  showSearch,
  value,
  onChange,
  onGeolocate,
  locating,
}: UnifiedHeroProps) {
  return (
    <div className='relative bg-gradient-to-br from-midnight via-midnight to-teal pt-28 pb-8 sm:pt-36 sm:pb-28 px-4'>
      <div
        className={`max-w-4xl mx-auto text-center ${showSearch ? "mb-4" : ""}`}>
        <p className='text-sage text-[12px] uppercase tracking-[4px] font-medium mb-3'>
          Brightstream Bank
        </p>
        <h1 className='font-playfair text-3xl sm:text-5xl font-bold text-warmWhite leading-tight tracking-tight'>
          Find Your Nearest <span className='text-gold'>Branch</span>
        </h1>
        <p className='text-cream/70 font-light text-sm sm:text-base mt-3 max-w-md mx-auto'>
          100 branches worldwide — search by name, city or postcode.
        </p>
      </div>

      {/* Search bar - mobile only */}
      {showSearch && (
        <div className='md:hidden max-w-2xl mx-auto '>
          <SearchBar
            value={value}
            onChange={onChange}
            onGeolocate={onGeolocate}
            locating={locating}
          />
        </div>
      )}
    </div>
  );
}
