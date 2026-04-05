import { useState } from "react";
import type { Branch } from "../types";

interface BranchCardProps {
  branch: Branch;
  index: number;
  onSelect: (branch: Branch) => void;
  isSelected: boolean;
  onOpenDrawer?: (branch: Branch) => void;
}

interface DetailRowProps {
  val: string | undefined;
  iconPath: string;
}

function DetailRow({ val, iconPath }: DetailRowProps) {
  if (!val) return null;
  return (
    <div className='flex items-center gap-2.5 text-[13px] text-slate'>
      <svg
        className='w-4 h-4 text-sage shrink-0'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={1.8}>
        <path d={iconPath} strokeLinecap='round' strokeLinejoin='round' />
      </svg>
      <span className='font-normal truncate' title={val}>{val}</span>
    </div>
  );
}

export default function BranchCard({
  branch,
  index,
  onSelect,
  isSelected,
  onOpenDrawer,
}: BranchCardProps) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const mapsUrl: string =
    branch.lat && branch.lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${branch.name} ${branch.city}`)}`;

  const distLabel: string | null =
    branch.distance == null
      ? null
      : branch.distance < 1
        ? `${Math.round(branch.distance * 1000)}m`
        : `${branch.distance.toFixed(1)}km`;

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
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
            className='lucide lucide-map-icon lucide-map text-slate'>
            <path d='M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z' />
            <path d='M15 5.764v15' />
            <path d='M9 3.236v15' />
          </svg>
          <span className='hidden sm:inline text-[10px] font-semibold uppercase tracking-wider text-slate group-hover:text-midnight transition-colors'>
            Directions
          </span>
        </a>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-slate/40 transition-transform duration-200 shrink-0 ${expanded ? "rotate-180" : ""}`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
          aria-hidden='true'>
          <path d='M6 9l6 6 6-6' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </div>

      {/* ── Footer Section (Always Visible) ── */}
      <div className='px-4 pb-3'>
        <div className='flex items-center flex-wrap gap-2 text-[12px] text-slate bg-cream/50 rounded-lg px-3 py-2'>
          {/* City */}
          <div className='flex items-center gap-1.5'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
              className='lucide lucide-building2-icon lucide-building-2'>
              <path d='M10 12h4' />
              <path d='M10 8h4' />
              <path d='M14 21v-3a2 2 0 0 0-4 0v3' />
              <path d='M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2' />
              <path d='M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16' />
            </svg>
            <span className='font-medium truncate' title={branch.city}>{branch.city}</span>
          </div>

          {/* Separator (desktop only) */}
          <span className='hidden sm:inline text-slate/30'>·</span>

          {/* Country */}
          <div className='flex items-center gap-1.5'>
            <svg
              className='w-4 h-4 text-sage shrink-0'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}>
              <path
                d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span className='font-medium truncate' title={branch.country}>{branch.country}</span>
          </div>

          {/* Separator (desktop only) */}
          {distLabel && (
            <span className='hidden sm:inline text-slate/30'>·</span>
          )}

          {/* Distance badge */}
          {distLabel && (
            <div className='flex  items-center gap-1 px-2 py-0.5 bg-midnight/5 rounded-md shrink-0 ml-auto sm:ml-0'>
              <svg
                className='w-4 h-4 text-sage shrink-0'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}>
                <path
                  d='M12 21s-8-7.5-8-12a8 8 0 1 1 16 0c0 4.5-8 12-8 12z'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <circle cx='12' cy='9' r='2' />
              </svg>
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
              <DetailRow
                val={branch.phone}
                iconPath='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
              />
              <DetailRow
                val={branch.email}
                iconPath='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
              />
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-2.5'>
              {branch.phone && (
                <DetailRow
                  val={branch.phone}
                  iconPath='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                />
              )}
              {branch.email && (
                <DetailRow
                  val={branch.email}
                  iconPath='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
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
