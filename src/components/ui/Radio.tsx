import { cn } from '../../lib/utils';

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: RadioOption[];
  label?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  direction?: 'vertical' | 'horizontal';
}

export function Radio({
  value,
  onChange,
  options = [],
  label,
  disabled = false,
  className,
  error,
  direction = 'horizontal',
}: RadioProps) {
  const handleChange = (optionValue: string, optionDisabled?: boolean) => {
    if (!disabled && !optionDisabled) {
      onChange?.(optionValue);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label className="text-sm font-medium leading-none">
          {label}
        </label>
      )}
      
      <div 
        className={cn(
          'flex gap-4',
          direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          const isDisabled = disabled || option.disabled;
          
          return (
            <label
              key={option.value}
              className={cn(
                'flex items-center gap-2 cursor-pointer',
                isDisabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isDisabled}
                onClick={() => handleChange(option.value, option.disabled)}
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border transition-colors cursor-pointer',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  isSelected 
                    ? 'border-zinc-900 dark:border-zinc-100' 
                    : 'border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-950 dark:hover:border-zinc-500',
                  error && 'border-red-500'
                )}
              >
                {isSelected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                )}
              </button>
              
              <span 
                onClick={() => handleChange(option.value, option.disabled)}
                className="text-sm"
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
