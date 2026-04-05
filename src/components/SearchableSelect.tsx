import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  SEARCH_ICON,
  CLEAR_ICON,
  CHECK_ICON,
  CHEVRON_ICON,
  REMOVE_ICON,
} from "../utils/selectHelpers";

interface SearchableSelectProps {
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  multiSelect?: boolean;
  className?: string;
  icon?: ReactNode;
}

// ============================================================================
// SEARCHABLE SELECT COMPONENT
// ============================================================================

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  disabled = false,
  multiSelect = false,
  className = "",
  icon,
}: SearchableSelectProps) => {
  // --------------------------------------------------------------------------
  // STATE
  // --------------------------------------------------------------------------
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // --------------------------------------------------------------------------
  // REFS
  // --------------------------------------------------------------------------
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // --------------------------------------------------------------------------
  // COMPUTED VALUES
  // --------------------------------------------------------------------------
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery]);

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const displayValue = multiSelect ? "" : selectedValues[0] || "";

  // --------------------------------------------------------------------------
  // HANDLERS
  // --------------------------------------------------------------------------
  const handleSelect = useCallback(
    (option: string) => {
      if (multiSelect) {
        const values = Array.isArray(value) ? value : [];
        if (values.includes(option)) {
          onChange(values.filter((v) => v !== option));
        } else {
          onChange([...values, option]);
        }
      } else {
        onChange(option);
        setIsOpen(false);
      }
      setSearchQuery("");
      setFocusedIndex(-1);
    },
    [multiSelect, value, onChange],
  );

  const handleRemove = useCallback(
    (option: string) => {
      if (multiSelect && Array.isArray(value)) {
        onChange(value.filter((v) => v !== option));
      }
    },
    [multiSelect, value, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
          setIsOpen(true);
          return;
        }
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            handleSelect(filteredOptions[focusedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchQuery("");
          setFocusedIndex(-1);
          break;
        case "Home":
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(filteredOptions.length - 1);
          break;
      }
    },
    [isOpen, filteredOptions, focusedIndex, handleSelect],
  );

  // --------------------------------------------------------------------------
  // EFFECTS
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [focusedIndex]);

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role='combobox'
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        className={`flex items-center gap-2 bg-cream text-midnight text-[13px] font-medium px-3 py-2 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
          disabled
            ? "opacity-40 cursor-not-allowed"
            : "border-transparent shadow-sm hover:border-midnight/20 focus-within:border-gold"
        }`}>
        {icon && <span className='shrink-0 text-midnight'>{icon}</span>}
        {label && (
          <span className='text-[12px] text-midnight whitespace-nowrap'>
            {label}
          </span>
        )}

        {/* Selected chips for multi-select */}
        {multiSelect && selectedValues.length > 0 && (
          <div className='flex items-center gap-1.5 flex-wrap'>
            {selectedValues.slice(0, 3).map((v) => (
              <span
                key={v}
                className='inline-flex items-center gap-1 px-2 py-0.5 bg-gold text-midnight rounded-full text-[12px] font-medium'>
                {v}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(v);
                  }}
                  className='hover:bg-midnight hover:text-warmWhite rounded-full p-0.5 transition-colors'>
                  {REMOVE_ICON}
                </button>
              </span>
            ))}
            {selectedValues.length > 3 && (
              <span className='text-[12px] text-slate'>
                +{selectedValues.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Single select value display */}
        {!multiSelect && (
          <span className='flex-1 truncate'>{displayValue || placeholder}</span>
        )}

        {/* Chevron icon - aligned to right */}
        <span className='ml-auto shrink-0'>{CHEVRON_ICON(isOpen)}</span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className='absolute z-50 w-full mt-1 bg-white rounded-xl shadow-[0_8px_40px_rgba(10,22,40,0.12)] border-2 border-cream overflow-hidden animate-fade-in-down'
          style={{
            animation: "fadeInDown 0.2s ease-out",
          }}>
          {/* Search Input */}
          <div className='sticky top-0 bg-white p-2 border-b border-cream'>
            <div className='relative'>
              {/* Search icon - positioned inside input on left */}
              <div className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate'>
                {SEARCH_ICON}
              </div>

              <input
                ref={inputRef}
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search...'
                className='w-full bg-cream text-midnight text-[13px] font-medium pl-9 pr-8 py-2 rounded-lg border-2 border-transparent focus:border-gold focus:shadow-[0_0_0_2px_rgba(212,175,55,0.2)] outline-none transition-all placeholder:text-slate/50'
                autoFocus
              />

              {/* Clear button - positioned inside input on right */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className='absolute right-2 top-1/2 -translate-y-1/2 text-slate hover:text-midnight transition-colors p-0.5'>
                  {CLEAR_ICON}
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <ul
            ref={listRef}
            role='listbox'
            className='max-h-60 overflow-y-auto py-1'>
            {filteredOptions.length === 0 ? (
              <li className='px-3 py-4 text-center text-[13px] text-slate italic'>
                No results found
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <li
                    key={option}
                    role='option'
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`px-3 py-2.5 cursor-pointer transition-colors ${
                      focusedIndex === index ? "bg-cream" : "hover:bg-cream/50"
                    } ${isSelected ? "bg-gold/10" : ""}`}>
                    <div className='flex items-center justify-between gap-2'>
                      <span className='flex-1 text-[13px] truncate'>
                        {option}
                      </span>
                      {isSelected && CHECK_ICON}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
