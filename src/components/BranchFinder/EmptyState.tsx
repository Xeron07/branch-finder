// ============================================================================
// TYPES
// ============================================================================

interface EmptyStateProps {
  query: string;
  onClear: () => void;
}

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

export const EmptyState = ({ query, onClear }: EmptyStateProps) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mb-4">
        <svg
          className="w-7 h-7 text-sage"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}>
          <path
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="font-playfair text-xl font-semibold text-midnight mb-1">
        No branches found
      </h3>

      {/* Message */}
      <p className="text-slate font-light text-[14px] mb-5 max-w-xs">
        {query
          ? `No results for "${query}". Try a different term.`
          : "No branches match the selected filters."}
      </p>

      {/* Action Button */}
      <button
        onClick={onClear}
        className="px-5 py-2 bg-midnight text-warmWhite rounded-full text-[13px] font-medium hover:bg-gold hover:text-midnight transition-all duration-200">
        Clear search
      </button>
    </div>
  );
};
