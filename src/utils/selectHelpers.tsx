/**
 * SVG icon constants for SearchableSelect component
 */

export const SEARCH_ICON = (
  <svg
    className='w-3.5 h-3.5 text-slate pointer-events-none'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}>
    <path
      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const CLEAR_ICON = (
  <svg
    className='w-4 h-4'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}>
    <path
      d='M6 18L18 6M6 6l12 12'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const CHECK_ICON = (
  <svg
    className='w-4 h-4 text-gold shrink-0'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2.5}>
    <path
      d='M5 13l4 4L19 7'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const CHEVRON_ICON = (isOpen: boolean) => (
  <svg
    className={`w-3.5 h-3.5 text-slate transition-transform duration-200 shrink-0 ${
      isOpen ? "rotate-180" : ""
    }`}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2.5}>
    <path d='M6 9l6 6 6-6' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

export const REMOVE_ICON = (
  <svg
    className='w-3 h-3'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2.5}>
    <path
      d='M6 18L18 6M6 6l12 12'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
