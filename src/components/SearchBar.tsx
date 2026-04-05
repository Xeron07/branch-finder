import { useState, useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onGeolocate: () => void;
  locating: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onGeolocate,
  locating,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={`relative flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 transition-all duration-300 ${
        focused
          ? "shadow-[0_0_0_2px_#d4af37] ring-2 ring-gold/20"
          : "shadow-[0_2px_8px_rgba(10,22,40,0.08)] hover:shadow-[0_4px_16px_rgba(10,22,40,0.12)]"
      }`}>
      {/* Search icon - inside the field */}
      <svg
        className='w-4 h-4 text-slate shrink-0 pointer-events-none'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}>
        <circle cx='11' cy='11' r='8' />
        <path d='M21 21l-4.35-4.35' strokeLinecap='round' />
      </svg>

      <input
        ref={inputRef}
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder='Search by branch name, city or postcode…'
        className='flex-1 bg-transparent text-midnight placeholder-slate/50 font-jost text-[15px] min-w-0 focus:outline-none'
      />

      {/* Clear button - inside the field */}
      {value && (
        <button
          onClick={handleClear}
          className='shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-cream/80 text-slate hover:bg-midnight hover:text-warmWhite transition-all duration-200 active:scale-95'>
          <svg
            className='w-3.5 h-3.5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2.5}>
            <path d='M18 6L6 18M6 6l12 12' strokeLinecap='round' />
          </svg>
        </button>
      )}

      {/* Divider */}
      <div className='w-px h-7 bg-cream shrink-0' />

      {/* Geolocate button - outside the field */}
      <button
        onClick={onGeolocate}
        title='Find branches near me'
        disabled={locating}
        className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 active:scale-95 ${
          locating
            ? "bg-gold/10 text-gold cursor-wait"
            : "bg-cream text-midnight hover:bg-gold hover:text-midnight"
        }`}>
        {locating ? (
          <svg
            className='w-4 h-4 animate-spin'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2.5}>
            <path
              d='M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83'
              strokeLinecap='round'
            />
          </svg>
        ) : (
          <svg
            className='w-5 h-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}>
            <path
              d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <circle cx='12' cy='10' r='3' />
          </svg>
        )}
        <span className='hidden sm:inline'>
          {locating ? "Locating…" : "Near me"}
        </span>
      </button>
    </div>
  );
}
