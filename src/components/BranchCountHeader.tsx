import { useState } from "react";
import type { SortBy, UserLocation } from "../types";

// ============================================================================
// TYPES
// ============================================================================

interface BranchCountHeaderProps {
  count: number;
  total: number;
  sortBy: SortBy;
  sortDescending: boolean;
  userLocation: UserLocation | null;
  onSortByChange: (sortBy: SortBy) => void;
  onSortDirectionChange: (descending: boolean) => void;
}

interface SortOption {
  value: SortBy;
  label: string;
  descending: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const BranchCountHeader = ({
  count,
  total,
  sortBy,
  sortDescending,
  userLocation,
  onSortByChange,
  onSortDirectionChange,
}: BranchCountHeaderProps) => {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const getSortLabel = (): string => {
    if (sortBy === "name") {
      return `Name ${sortDescending ? "(Z-A)" : "(A-Z)"}`;
    }
    if (sortBy === "city") {
      return `City ${sortDescending ? "(Z-A)" : "(A-Z)"}`;
    }
    return "Nearest first";
  };

  const getSortOptions = (): SortOption[] => {
    const options: SortOption[] = [
      { value: "name", label: "Name (A-Z)", descending: false },
      { value: "name", label: "Name (Z-A)", descending: true },
      { value: "city", label: "City (A-Z)", descending: false },
      { value: "city", label: "City (Z-A)", descending: true },
    ];

    // Only add Nearest first option if user location is available
    if (userLocation) {
      options.push({ value: "distance", label: "Nearest first", descending: false });
    }

    return options;
  };

  const handleSortSelect = (option: SortOption) => {
    onSortByChange(option.value);
    onSortDirectionChange(option.descending);
    setSortDropdownOpen(false);
  };

  const isOptionSelected = (option: SortOption): boolean => {
    return option.value === sortBy && option.descending === sortDescending;
  };

  return (
    <div className="flex items-center justify-between px-1 py-2 mb-1">
      {/* Branch count */}
      <p className="text-[13px] text-slate font-normal">
        Showing <span className="font-semibold text-midnight">{count}</span> of{" "}
        <span className="font-semibold text-midnight">{total}</span> branches
      </p>

      {/* Sort dropdown */}
      <div className="relative">
        <button
          onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          className="flex items-center gap-1.5 text-[13px] text-slate hover:text-midnight transition-colors duration-200 group"
          title="Sort by">
          <span className="hidden sm:inline text-slate/60">Sort by</span>
          <span className="font-medium text-midnight">{getSortLabel()}</span>
          <svg
            className={`w-4 h-4 text-slate/60 group-hover:text-midnight transition-transform duration-200 ${
              sortDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {sortDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-[0_8px_40px_rgba(10,22,40,0.12)] border-2 border-cream overflow-hidden z-50 min-w-[160px]">
            {getSortOptions().map((option, index) => (
              <button
                key={`${option.value}-${option.descending}-${index}`}
                onClick={() => handleSortSelect(option)}
                className={`w-full px-3 py-2.5 text-left text-[13px] transition-colors ${
                  isOptionSelected(option)
                    ? "bg-gold/10 text-gold font-medium"
                    : "text-slate hover:bg-cream/50"
                }`}>
                <div className="flex items-center justify-between gap-2">
                  <span>{option.label}</span>
                  {isOptionSelected(option) && (
                    <svg
                      className="w-4 h-4 text-gold shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}>
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
