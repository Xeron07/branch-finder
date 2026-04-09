import {
  MapIcon,
  BuildingIcon,
  GlobeIcon,
  ChevronDownIcon,
  MapPinIcon,
  PhoneIcon,
  EmailIcon,
} from "../components/icons/IconLibrary";
import { buildMapsUrl, formatDistance } from "../utils/common";
import type { Branch } from "../types";
import { forwardRef } from "react";

interface BranchCardProps {
  branch: Branch;
  index: number;
  onSelect: (branch: Branch) => void;
  isSelected: boolean;
  onOpenDrawer?: (branch: Branch) => void;
}

const hasContactInfo = (branch: Branch): boolean =>
  Boolean(branch.phone || branch.email);

const BranchCard = forwardRef<HTMLDivElement, BranchCardProps>(
  (
    { branch, index, onSelect, isSelected, onOpenDrawer }: BranchCardProps,
    ref,
  ) => {
    const mapsUrl = buildMapsUrl(branch);
    const distLabel = formatDistance(branch.distance ?? null);
    const expanded = isSelected;

    const handleToggle = (): void => {
      if (onOpenDrawer) {
        onOpenDrawer(branch);
        return;
      }
      onSelect(branch);
    };

    return (
      <div
        ref={ref}
        className={`rounded-xl mx-2 border transition-all duration-200 overflow-hidden animate-fade-in-up ${
          isSelected
            ? "border-gold bg-white shadow-[0_4px_20px_rgba(212,175,55,0.18)]"
            : "border-midnight/10 shadow-sm bg-white hover:border-midnight/30 hover:shadow-[0_2px_12px_rgba(10,22,40,0.06)]"
        }`}
        style={{
          animationDelay: `${Math.min(index * 40, 300)}ms`,
          animationFillMode: "both",
          opacity: 0,
        }}>
        <div
          className='cursor-pointer'
          onClick={handleToggle}
          role='button'
          aria-expanded={expanded}
          aria-label={`${branch.name} — tap to ${expanded ? "collapse" : "expand"} contact details`}>
          {/* ── Header ── */}
          <div className='flex items-center px-3 py-2.5 gap-2.5'>
            <div className='flex-1 min-w-0'>
              <p className='font-playfair font-semibold text-midnight text-[14px] leading-snug truncate'>
                {branch.name}
              </p>
              {branch.address && (
                <p
                  className='text-[11px] text-slate font-normal mt-0.5 truncate'
                  title={branch.address}>
                  {branch.address}
                </p>
              )}
            </div>

            {/* Directions */}
            <a
              href={mapsUrl}
              target='_blank'
              rel='noopener noreferrer'
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className='flex items-center gap-1 px-2 py-1 bg-midnight/5 hover:bg-midnight/10 rounded-lg shrink-0 transition-colors group'
              aria-label={`Get directions to ${branch.name}`}>
              <MapIcon size={14} className='text-slate' />
              <span className='hidden sm:inline text-[10px] font-semibold uppercase tracking-wider text-slate group-hover:text-midnight transition-colors'>
                Directions
              </span>
            </a>

            {/* Chevron — only shown when contact info exists */}
            {hasContactInfo(branch) && (
              <ChevronDownIcon
                size={14}
                className={`transition-all duration-200 shrink-0 ${
                  expanded ? "rotate-180 text-gold" : "text-slate/40"
                }`}
              />
            )}
          </div>

          {/* ── City / country / distance row ── */}
          <div className='px-3 pb-2.5'>
            <div className='flex items-center flex-wrap gap-1.5 text-[11px] text-slate bg-cream/60 rounded-lg px-2.5 py-1.5'>
              <div className='flex items-center gap-1'>
                <BuildingIcon size={13} className='text-sage shrink-0' />
                <span className='font-medium truncate' title={branch.city}>
                  {branch.city}
                </span>
              </div>

              <span className='text-slate/30'>·</span>

              <div className='flex items-center gap-1'>
                <GlobeIcon size={13} className='text-sage shrink-0' />
                <span className='font-medium truncate' title={branch.country}>
                  {branch.country}
                </span>
              </div>

              {distLabel && (
                <>
                  <span className='text-slate/30'>·</span>
                  <div className='flex items-center gap-1 px-1.5 py-0.5 bg-midnight/5 rounded shrink-0 ml-auto sm:ml-0'>
                    <MapPinIcon size={13} className='text-sage shrink-0' />
                    <span className='text-[10px] font-semibold text-midnight tabular-nums'>
                      {distLabel}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Expanded contact panel ── */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expanded ? "max-h-32" : "max-h-0"
          }`}>
          <div className='border-t border-cream/80 mx-3' />
          <div className='px-3 py-2.5 grid grid-cols-1 sm:flex sm:items-center sm:justify-start sm:gap-4 gap-2'>
            {branch.phone && (
              <div className='flex items-center gap-2 text-[12px] text-slate cursor-pointer'>
                <PhoneIcon size={14} className='shrink-0 text-sage' />
                <a
                  href={`tel:${branch.phone}`}
                  className='font-normal truncate'
                  title={branch.phone}>
                  {branch.phone}
                </a>
              </div>
            )}

            {branch.email && (
              <div className='flex items-center gap-2 text-[12px] text-slate cursor-pointer'>
                <EmailIcon size={14} className='shrink-0 text-sage' />
                <a
                  href={`mailto:${branch.email}`}
                  className='font-normal truncate'
                  title={branch.email}>
                  {branch.email}
                </a>
              </div>
            )}

            {!hasContactInfo(branch) && (
              <p className='sm:col-span-2 text-[12px] text-slate/50 text-center py-1'>
                Contact information not available
              </p>
            )}
          </div>
        </div>
      </div>
    );
  },
);

BranchCard.displayName = "BranchCard";

export default BranchCard;
