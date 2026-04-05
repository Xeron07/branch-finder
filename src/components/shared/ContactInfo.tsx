import { PhoneIcon, EmailIcon } from '../icons/IconLibrary';
import type { Branch } from '../../types';

interface ContactInfoProps {
  branch: Branch;
  className?: string;
}

export function ContactInfo({ branch, className = '' }: ContactInfoProps) {
  const hasContact = branch.phone || branch.email;

  if (!hasContact) {
    return (
      <p className={`text-[13px] text-slate font-normal text-center py-2 ${className}`}>
        Contact information not available
      </p>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {branch.phone && (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0">
            <PhoneIcon size={16} className="text-sage" />
          </div>
          <a
            href={`tel:${branch.phone}`}
            className="text-[13px] text-midnight font-normal hover:text-gold transition-colors">
            {branch.phone}
          </a>
        </div>
      )}

      {branch.email && (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0">
            <EmailIcon size={16} className="text-sage" />
          </div>
          <a
            href={`mailto:${branch.email}`}
            className="text-[13px] text-midnight font-normal hover:text-gold transition-colors">
            {branch.email}
          </a>
        </div>
      )}
    </div>
  );
}
