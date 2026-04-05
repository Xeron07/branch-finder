import MapView from "./MapView";
import type { Branch, UserLocation } from "../types";

interface BranchDrawerProps {
  branch: Branch | null;
  isOpen: boolean;
  onClose: () => void;
  branches: Branch[];
  selectedBranch: Branch | null;
  onSelectBranch: (branch: Branch) => void;
  userLocation: UserLocation | null;
}

export default function BranchDrawer({
  branch,
  isOpen,
  onClose,
  branches,
  selectedBranch,
  onSelectBranch,
  userLocation,
}: BranchDrawerProps) {
  if (!branch) return null;

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

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-midnight/40 z-[1500] md:hidden'
          onClick={onClose}
          style={{
            animation: "fadeIn 0.2s ease-out",
          }}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-[2000] md:hidden bg-white rounded-t-3xl shadow-[0_8px_40px_rgba(10,22,40,0.25)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          maxHeight: "85vh",
        }}>
        {/* Handle bar */}
        <div className='flex justify-center pt-2 pb-1'>
          <div className='w-10 h-1 bg-cream rounded-full' />
        </div>

        {/* Header with close button */}
        <div className='flex items-center justify-between px-5 py-3 border-b border-cream'>
          <h2 className='font-playfair text-lg font-semibold text-midnight'>
            Branch Details
          </h2>
          <button
            onClick={onClose}
            className='w-8 h-8 flex items-center justify-center rounded-full bg-cream text-midnight hover:bg-midnight hover:text-warmWhite transition-all duration-200'
            aria-label='Close drawer'>
            <svg
              className='w-4 h-4'
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
          </button>
        </div>

        {/* Content */}
        <div
          className='px-5 py-4 overflow-y-auto'
          style={{ maxHeight: "calc(85vh - 60px)" }}>
          {/* Branch name */}
          <h3 className='font-playfair text-xl font-bold text-midnight mb-1'>
            {branch.name}
          </h3>
          <p className='text-[13px] text-slate font-normal mb-4'>
            {[branch.address, branch.city, branch.country].filter(Boolean).join(" · ")}
          </p>

          {/* Distance badge */}
          {distLabel && (
            <div className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 text-midnight rounded-full text-[12px] font-medium mb-4'>
              <svg
                className='w-3.5 h-3.5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={1.8}>
                <path
                  d='M12 21s-8-7.5-8-12a8 8 0 1 1 16 0c0 4.5-8 12-8 12z'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <circle cx='12' cy='9' r='2.5' />
              </svg>
              {distLabel} away
            </div>
          )}

          {/* Contact details */}
          <div className='space-y-3 mb-5'>
            {branch.phone && (
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0'>
                  <svg
                    className='w-4 h-4 text-sage'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.8}>
                    <path
                      d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <a
                  href={`tel:${branch.phone}`}
                  className='text-[13px] text-midnight font-normal hover:text-gold transition-colors'>
                  {branch.phone}
                </a>
              </div>
            )}

            {branch.email && (
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0'>
                  <svg
                    className='w-4 h-4 text-sage'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.8}>
                    <path
                      d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <a
                  href={`mailto:${branch.email}`}
                  className='text-[13px] text-midnight font-normal hover:text-gold transition-colors'>
                  {branch.email}
                </a>
              </div>
            )}

            {!branch.phone && !branch.email && (
              <p className='text-[13px] text-slate font-normal text-center py-2'>
                Contact information not available
              </p>
            )}
          </div>

          {/* Map View */}
          {branch.lat && branch.lng && (
            <div className='mb-4'>
              <div className='h-64 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(10,22,40,0.12)]'>
                <MapView
                  branches={branches}
                  selectedBranch={selectedBranch}
                  onSelectBranch={onSelectBranch}
                  userLocation={userLocation}
                />
              </div>
            </div>
          )}

          {/* Get directions button */}
          <a
            href={mapsUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center justify-center gap-2 w-full px-5 py-3 bg-midnight text-warmWhite rounded-xl text-[14px] font-medium hover:bg-gold hover:text-midnight transition-all duration-200 active:scale-98'>
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}>
              <path
                d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            Get directions
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
