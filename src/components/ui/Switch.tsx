import { cn } from '../../lib/utils';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  error?: string;
}

export function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  className,
  id,
  name,
  error,
}: SwitchProps) {
  const handleChange = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  const switchId = id || name;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <button
        type="button"
        role="switch"
        id={switchId}
        name={name}
        aria-checked={checked}
        disabled={disabled}
        onClick={handleChange}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked 
            ? 'bg-zinc-900 dark:bg-zinc-100' 
            : 'bg-zinc-200 dark:bg-zinc-800',
          error && 'border-red-500'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white dark:bg-zinc-900 shadow-lg ring-0 transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
      
      {label && (
        <label
          htmlFor={switchId}
          onClick={handleChange}
          className={cn(
            'text-sm leading-none cursor-pointer',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {label}
        </label>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
