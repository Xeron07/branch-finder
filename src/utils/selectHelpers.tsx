/**
 * Icon constants for SearchableSelect component
 * Uses icons from IconLibrary for consistency
 */

import { SearchIcon, CloseIcon, CheckIcon, ChevronDownIcon, XIcon } from "../components/icons/IconLibrary";

export const SEARCH_ICON = (
  <SearchIcon size={14} className="text-slate pointer-events-none" />
);

export const CLEAR_ICON = (
  <CloseIcon size={16} />
);

export const CHECK_ICON = (
  <CheckIcon size={16} className="text-gold shrink-0" />
);

export const CHEVRON_ICON = (isOpen: boolean) => (
  <ChevronDownIcon
    size={14}
    className={`text-slate transition-transform duration-200 shrink-0 ${
      isOpen ? "rotate-180" : ""
    }`}
  />
);

export const REMOVE_ICON = (
  <XIcon size={12} />
);
