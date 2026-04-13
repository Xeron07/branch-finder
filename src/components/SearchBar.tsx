import { useState, useRef, useEffect } from "react";
import {
  SearchIcon,
  CloseIcon,
  MapPinIcon,
} from "../components/icons/IconLibrary";
import useDebounce from "../hooks/useDebounce";

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
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the search input with 280ms delay
  const debouncedValue = useDebounce(localValue, 280);

  // Update parent when debounced value changes
  useEffect(() => {
    onChange(debouncedValue);
    //eslint-disable-next-line
  }, [debouncedValue]);

  // Update local value when prop changes (e.g., when cleared from parent)
  // useEffect(() => {
  //   setLocalValue(value);
  // }, [value]);

  const handleClear = () => {
    setLocalValue("");
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
      <SearchIcon
        size={16}
        className='text-slate shrink-0 pointer-events-none'
      />

      <input
        ref={inputRef}
        type='text'
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder='Search by branch name, city or postcode…'
        className='flex-1 bg-transparent text-midnight placeholder-slate/50 font-jost text-[15px] min-w-0 focus:outline-none'
      />

      {/* Clear button - inside the field */}
      {localValue && (
        <button
          onClick={handleClear}
          className='shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-cream/80 text-slate hover:bg-midnight hover:text-warmWhite transition-all duration-200 active:scale-95'>
          <CloseIcon size={14} />
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
          <MapPinIcon size={20} />
        )}
        <span className='hidden sm:inline'>
          {locating ? "Locating…" : "Near me"}
        </span>
      </button>
    </div>
  );
}
