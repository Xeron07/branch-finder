import MapView from "./MapView";
import { CloseIcon, MapPinIcon, PhoneIcon, EmailIcon, MapIcon } from "../components/icons/IconLibrary";
import { formatDistance, buildMapsUrl, formatLocationString } from "../utils/common";
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

  const mapsUrl = buildMapsUrl(branch);
  const distLabel = formatDistance(branch.distance ?? null);

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
            <CloseIcon size={16} />
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
            {formatLocationString(branch)}
          </p>

          {/* Distance badge */}
          {distLabel && (
            <div className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 text-midnight rounded-full text-[12px] font-medium mb-4'>
              <MapPinIcon size={14} className="shrink-0" />
              {distLabel} away
            </div>
          )}

          {/* Contact details */}
          <div className='space-y-3 mb-5'>
            {branch.phone && (
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0'>
                  <PhoneIcon size={16} className="text-sage" />
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
                  <EmailIcon size={16} className="text-sage" />
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
            <MapIcon size={16} className="text-warmWhite" />
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
