import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  error?: string;
}

export function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  className,
  id,
  name,
  error,
}: CheckboxProps) {
  const handleChange = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  const checkboxId = id || name;

  return (
    <div className={cn('flex items-start gap-2', className)}>
      <button
        type="button"
        role="checkbox"
        id={checkboxId}
        name={name}
        aria-checked={checked}
        disabled={disabled}
        onClick={handleChange}
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded border transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked 
            ? 'border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100' 
            : 'border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-950 dark:hover:border-zinc-500',
          error && 'border-red-500'
        )}
      >
        {checked && <Check className="h-3.5 w-3.5 text-white dark:text-zinc-900" />}
      </button>
      
      {label && (
        <label
          htmlFor={checkboxId}
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
        <p className="w-full text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
