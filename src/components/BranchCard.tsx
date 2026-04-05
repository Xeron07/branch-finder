import { useState } from "react";
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

interface BranchCardProps {
  branch: Branch;
  index: number;
  onSelect: (branch: Branch) => void;
  isSelected: boolean;
  onOpenDrawer?: (branch: Branch) => void;
}

const hasContactInfo = (branch: Branch): boolean =>
  Boolean(branch.phone || branch.email);

export default function BranchCard({
  branch,
  index,
  onSelect,
  isSelected,
  onOpenDrawer,
}: BranchCardProps) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const mapsUrl = buildMapsUrl(branch);
  const distLabel = formatDistance(branch.distance ?? null);

  const handleToggle = (): void => {
    if (onOpenDrawer) {
      onOpenDrawer(branch);
      return;
    }
    // Only call onSelect (notify parent) when opening — not when closing.
    // This prevents the parent toggle (prev?.id === b.id ? null : b) from
    // immediately deselecting the branch that was just selected, which caused
    // the first card to appear pre-selected and close on first click.
    if (!expanded) {
      setExpanded(true);
      onSelect(branch);
    } else {
      setExpanded(false);
      // Do not call onSelect here — let the parent keep selectedBranch set
      // so the card retains its gold border styling until another is chosen.
    }
  };

  return (
    <div
      className={`rounded-2xl mx-2 border transition-all duration-200 overflow-hidden animate-fade-in-up ${
        isSelected
          ? "border-gold bg-white shadow-[0_4px_20px_rgba(212,175,55,0.18)]"
          : "border-midnight/10 shadow-sm bg-white hover:border-midnight/40 hover:shadow-[0_4px_16px_rgba(10,22,40,0.08)]"
      }`}
      style={{
        animationDelay: `${Math.min(index * 40, 300)}ms`,
        animationFillMode: "both",
        opacity: 0,
      }}>
      {/* Fix 1: entire card top section is the click target, not just the header row */}
      <div
        className='cursor-pointer'
        onClick={handleToggle}
        role='button'
        aria-expanded={expanded}
        aria-label={`${branch.name} — tap to ${expanded ? "collapse" : "expand"} contact details`}>
        {/* ── Header ── */}
        <div className='flex items-center px-4 pt-3 pb-2 gap-3'>
          <div className='flex-1 min-w-0'>
            <p className='font-playfair font-semibold text-midnight text-[15px] leading-snug truncate'>
              {branch.name}
            </p>
            {branch.address && (
              <p
                className='text-[12px] text-slate font-normal mt-0.5 truncate'
                title={branch.address}>
                {branch.address}
              </p>
            )}
          </div>

          <a
            href={mapsUrl}
            target='_blank'
            rel='noopener noreferrer'
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className='flex items-center gap-1.5 px-2.5 py-1 bg-midnight/5 hover:bg-midnight/10 rounded-lg shrink-0 transition-colors group'
            aria-label={`Get directions to ${branch.name}`}>
            <MapIcon size={16} className='text-slate' />
            <span className='hidden sm:inline text-[10px] font-semibold uppercase tracking-wider text-slate group-hover:text-midnight transition-colors'>
              Directions
            </span>
          </a>
        </div>

        {/* ── City / country / distance row ── */}
        <div className='px-4 pb-3'>
          <div className='flex items-center flex-wrap gap-2 text-[12px] text-slate bg-cream/50 rounded-lg px-3 py-2'>
            <div className='flex items-center gap-1.5'>
              <BuildingIcon size={16} className='text-sage shrink-0' />
              <span className='font-medium truncate' title={branch.city}>
                {branch.city}
              </span>
            </div>

            <span className='hidden sm:inline text-slate/30'>·</span>

            <div className='flex items-center gap-1.5'>
              <GlobeIcon size={16} className='text-sage shrink-0' />
              <span className='font-medium truncate' title={branch.country}>
                {branch.country}
              </span>
            </div>

            {distLabel && (
              <>
                <span className='hidden sm:inline text-slate/30'>·</span>
                <div className='flex items-center gap-1 px-2 py-0.5 bg-midnight/5 rounded-md shrink-0 ml-auto sm:ml-0'>
                  <MapPinIcon size={16} className='text-sage shrink-0' />
                  <span className='text-[11px] font-semibold text-midnight tabular-nums'>
                    {distLabel}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dedicated expand trigger — own row, dashed border, label changes on state */}
        {hasContactInfo(branch) && (
          <div
            className={`mx-4 mb-3 flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 ${
              expanded
                ? "border-gold/40 bg-gold/5"
                : "border-dashed border-midnight/15 hover:border-midnight/30"
            }`}>
            <span
              className={`text-[12px] font-medium transition-colors duration-200 ${
                expanded ? "text-gold" : "text-slate/60"
              }`}>
              {expanded ? "Hide contact info" : "Show contact info"}
            </span>
            <ChevronDownIcon
              size={14}
              className={`transition-all duration-200 ${
                expanded ? "rotate-180 text-gold" : "text-slate/40"
              }`}
            />
          </div>
        )}
      </div>

      {/* ── Expanded contact panel ── */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-40" : "max-h-0"
        }`}>
        <div className='border-t border-cream mx-4' />

        {/* Fix 5: one flat conditional per field — no nested branching */}
        <div className='px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
          {branch.phone && (
            <div className='flex items-center gap-2.5 text-[13px] text-slate'>
              <PhoneIcon size={16} className='shrink-0 text-sage' />
              <span className='font-normal truncate' title={branch.phone}>
                {branch.phone}
              </span>
            </div>
          )}

          {branch.email && (
            <div className='flex items-center gap-2.5 text-[13px] text-slate'>
              <EmailIcon size={16} className='shrink-0 text-sage' />
              <span className='font-normal truncate' title={branch.email}>
                {branch.email}
              </span>
            </div>
          )}

          {!hasContactInfo(branch) && (
            <p className='sm:col-span-2 text-[13px] text-slate/60 text-center py-1'>
              Contact information not available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
