import { MapPinIcon } from '../icons/IconLibrary';

interface DistanceBadgeProps {
  distance: number | null;
  className?: string;
}

export function DistanceBadge({ distance, className = '' }: DistanceBadgeProps) {
  if (!distance) return null;

  const distLabel =
    distance < 1
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 text-midnight rounded-full text-[12px] font-medium ${className}`}>
      <MapPinIcon size={14} className="shrink-0" />
      <span>{distLabel} away</span>
    </div>
  );
}
