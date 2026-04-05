import { AlertCircleIcon, SearchIcon } from '../icons/IconLibrary';

interface BaseErrorStateProps {
  type: 'error' | 'empty' | 'search-error';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'secondary';
}

export function BaseErrorState({
  type,
  title,
  message,
  actionLabel,
  onAction,
  actionVariant = 'primary',
}: BaseErrorStateProps) {
  const iconColors = {
    error: 'text-red-500',
    empty: 'text-sage',
    'search-error': 'text-amber-500',
  };

  const Icon = type === 'search-error' ? SearchIcon : AlertCircleIcon;

  const buttonClass = actionVariant === 'primary'
    ? 'bg-midnight text-warmWhite hover:bg-gold hover:text-midnight'
    : 'bg-cream text-midnight hover:bg-midnight hover:text-warmWhite';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className={`w-16 h-16 rounded-full bg-cream/50 flex items-center justify-center mb-4 ${iconColors[type]}`}>
        <Icon size={32} />
      </div>

      <h3 className="font-playfair text-xl font-semibold text-midnight mb-2 text-center">
        {title}
      </h3>

      <p className="text-slate text-center max-w-md mb-6">
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`px-6 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 active:scale-98 ${buttonClass}`}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
