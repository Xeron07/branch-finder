// ============================================================================
// TYPES
// ============================================================================

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

// ============================================================================
// ERROR STATE COMPONENT
// ============================================================================

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div className="max-w-md mx-auto py-20 text-center">
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-7 h-7 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}>
          <path
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="font-playfair text-xl font-semibold text-midnight mb-2">
        Unable to load branches
      </h3>

      {/* Message */}
      <p className="text-slate font-light text-[14px] mb-5">{message}</p>

      {/* Action Button */}
      <button
        onClick={onRetry}
        className="px-5 py-2 bg-gold text-midnight rounded-full text-[14px] font-medium hover:bg-midnight hover:text-warmWhite transition-all duration-200">
        Try Again
      </button>
    </div>
  );
};
