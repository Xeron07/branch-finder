import { ArrowLeftIcon } from "../icons/IconLibrary";
import type { Branch } from "../../types";

interface MobileMapControlsProps {
  selectedBranch: Branch | null;
  onBackToList: () => void;
  onSelectBranch: (branch: Branch) => void;
}

export function MobileMapControls({
  selectedBranch,
  onBackToList,
  onSelectBranch,
}: MobileMapControlsProps) {
  return (
    <>
      {/* Back to list button */}
      <button
        onClick={onBackToList}
        className='ml-4 mb-3 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-[0_2px_8px_rgba(10,22,40,0.12)] hover:shadow-[0_4px_16px_rgba(10,22,40,0.16)] transition-all duration-200 active:scale-98'
        aria-label='Back to list'>
        <ArrowLeftIcon size={16} className='text-slate' />
        <span className='text-[13px] font-medium text-midnight'>Back to list</span>
      </button>

      {/* Selected branch mini card */}
      {selectedBranch && (
        <div className='mx-4 mb-3 p-3 bg-white rounded-xl shadow-[0_2px_8px_rgba(10,22,40,0.12)]'>
          <div className='flex items-center gap-3'>
            <div className='flex-1 min-w-0'>
              <p className='font-playfair font-semibold text-midnight text-[15px] truncate'>
                {selectedBranch.name}
              </p>
              <p className='text-[12px] text-slate truncate'>
                {selectedBranch.city}, {selectedBranch.country}
              </p>
            </div>
            <button
              onClick={() => onSelectBranch(selectedBranch)}
              className='shrink-0 px-3 py-1.5 bg-gold/10 text-midnight rounded-lg text-[12px] font-medium hover:bg-gold/20 transition-colors'>
              Details
            </button>
          </div>
        </div>
      )}
    </>
  );
}
