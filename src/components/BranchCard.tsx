import { useState } from "react";
import { MapIcon, BuildingIcon, GlobeIcon, ChevronDownIcon, MapPinIcon, PhoneIcon, EmailIcon } from "../components/icons/IconLibrary";
import { buildMapsUrl, formatDistance } from "../utils/common";
import type { Branch } from "../types";

interface BranchCardProps {
  branch: Branch;
  index: number;
  onSelect: (branch: Branch) => void;
  isSelected: boolean;
  onOpenDrawer?: (branch: Branch) => void;
}

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
    // If onOpenDrawer is provided (mobile), open the drawer
    if (onOpenDrawer) {
      onOpenDrawer(branch);
    } else {
      // Desktop behavior: expand the card
      setExpanded((e) => !e);
      onSelect(branch);
    }
  };

  return (
    <div
      className={`rounded-2xl mx-2 border transition-all duration-200 overflow-hidden animate-fade-in-up ${
        isSelected
          ? "border-gold bg-white shadow-[0_4px_20px_rgba(212,175,55,0.18)]"
          : "border-midnight/10 shadow-sm  bg-white hover:border-midnight/40 hover:shadow-[0_4px_16px_rgba(10,22,40,0.08)]"
      }`}
      style={{
        animationDelay: `${Math.min(index * 40, 300)}ms`,
        animationFillMode: "both",
        opacity: 0,
      }}>
      {/* ── Header Section (Clickable) ── */}
      <div
        className='flex items-center px-4 py-3 gap-3 cursor-pointer'
        onClick={handleToggle}
        role='button'
        aria-expanded={expanded}
        aria-label={`Toggle details for ${branch.name}`}>
        {/* Branch info */}
        <div className='flex-1 min-w-0'>
          {/* Name */}
          <p className='font-playfair font-semibold text-midnight text-[15px] leading-snug truncate'>
            {branch.name}
          </p>

          {/* Address */}
          {branch.address && (
            <p className='text-[12px] text-slate font-normal mt-0.5 truncate' title={branch.address}>
              {branch.address}
            </p>
          )}
        </div>

        {/* Directions button */}
        <a
          href={mapsUrl}
          target='_blank'
          rel='noopener noreferrer'
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          className='flex items-center gap-1.5 px-2.5 py-1 bg-midnight/5 hover:bg-midnight/10 rounded-lg shrink-0 transition-colors group'
          aria-label={`Get directions to ${branch.name}`}>
          <MapIcon size={16} className="text-slate" />
          <span className='hidden sm:inline text-[10px] font-semibold uppercase tracking-wider text-slate group-hover:text-midnight transition-colors'>
            Directions
          </span>
        </a>

        {/* Chevron */}
        <ChevronDownIcon
          size={16}
          className={`text-slate/40 transition-transform duration-200 shrink-0 ${expanded ? "rotate-180" : ""}`}
        />
      </div>

      {/* ── Footer Section (Always Visible) ── */}
      <div className='px-4 pb-3'>
        <div className='flex items-center flex-wrap gap-2 text-[12px] text-slate bg-cream/50 rounded-lg px-3 py-2'>
          {/* City */}
          <div className='flex items-center gap-1.5'>
            <BuildingIcon size={16} className="text-sage shrink-0" />
            <span className='font-medium truncate' title={branch.city}>{branch.city}</span>
          </div>

          {/* Separator (desktop only) */}
          <span className='hidden sm:inline text-slate/30'>·</span>

          {/* Country */}
          <div className='flex items-center gap-1.5'>
            <GlobeIcon size={16} className="text-sage shrink-0" />
            <span className='font-medium truncate' title={branch.country}>{branch.country}</span>
          </div>

          {/* Separator (desktop only) */}
          {distLabel && (
            <span className='hidden sm:inline text-slate/30'>·</span>
          )}

          {/* Distance badge */}
          {distLabel && (
            <div className='flex items-center gap-1 px-2 py-0.5 bg-midnight/5 rounded-md shrink-0 ml-auto sm:ml-0'>
              <MapPinIcon size={16} className="text-sage shrink-0" />
              <span className='text-[11px] font-semibold text-midnight tabular-nums'>
                {distLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Expanded detail panel ── */}
      <div
        className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-64" : "max-h-0"}`}>
        <div className='border-t border-cream mx-4' />
        <div className='px-4 py-4'>
          {branch.phone && branch.email ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
              <div className='flex items-center gap-2.5 text-[13px] text-slate'>
                <PhoneIcon size={16} className="shrink-0 text-sage" />
                <span className='font-normal truncate' title={branch.phone}>{branch.phone}</span>
              </div>
              <div className='flex items-center gap-2.5 text-[13px] text-slate'>
                <EmailIcon size={16} className="shrink-0 text-sage" />
                <span className='font-normal truncate' title={branch.email}>{branch.email}</span>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-2.5'>
              {branch.phone && (
                <div className='flex items-center gap-2.5 text-[13px] text-slate'>
                  <PhoneIcon size={16} className="shrink-0 text-sage" />
                  <span className='font-normal truncate' title={branch.phone}>{branch.phone}</span>
                </div>
              )}
              {branch.email && (
                <div className='flex items-center gap-2.5 text-[13px] text-slate'>
                  <EmailIcon size={16} className="shrink-0 text-sage" />
                  <span className='font-normal truncate' title={branch.email}>{branch.email}</span>
                </div>
              )}
              {!branch.phone && !branch.email && (
                <p className='text-[13px] text-slate font-normal text-center py-2'>
                  Contact information not available
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
