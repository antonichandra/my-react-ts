import { useState, useRef, useEffect, useCallback } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  format?: '12h' | '24h';
  minuteInterval?: number;
}

// Helper function to parse time - defined outside component
function parseTimeValue(value: string | undefined, format: '12h' | '24h'): { hours: number; minutes: number; period: 'AM' | 'PM' } {
  if (!value) {
    return { hours: 0, minutes: 0, period: 'AM' };
  }
  
  const [timePart] = value.split(' ');
  const [h, m] = timePart.split(':').map(Number);
  
  let period: 'AM' | 'PM' = 'AM';
  let hours = h || 0;
  
  if (format === '12h') {
    const isPM = value.toLowerCase().includes('pm');
    period = isPM ? 'PM' : 'AM';
    hours = isPM ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
  }
  
  return { hours, minutes: m || 0, period };
}

// Lazy initializer function for useState - only runs on initial render
// (kept for documentation purposes - using inline lazy initializers instead)

export function TimePicker({
  value,
  onChange,
  placeholder = 'Select time',
  disabled = false,
  className,
  format = '24h',
  minuteInterval = 1,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Lazy initializer - only runs once on mount
  const [hours, setHours] = useState<number>(() => {
    const parsed = parseTimeValue(value, format);
    return parsed.hours;
  });
  
  const [minutes, setMinutes] = useState<number>(() => {
    const parsed = parseTimeValue(value, format);
    return parsed.minutes;
  });
  
  const [period, setPeriod] = useState<'AM' | 'PM'>(() => {
    const parsed = parseTimeValue(value, format);
    return parsed.period;
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = useCallback((): string => {
    let hour = hours;
    let periodValue = period;
    
    if (format === '12h') {
      if (hour >= 12) {
        periodValue = 'PM';
        hour = hour === 12 ? 12 : hour - 12;
      } else {
        periodValue = 'AM';
        hour = hour === 0 ? 12 : hour;
      }
    }
    
    const h = String(hour).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    
    if (format === '12h') {
      return `${h}:${m} ${periodValue}`;
    }
    return `${h}:${m}`;
  }, [hours, minutes, period, format]);

  const handleTimeChange = useCallback(() => {
    const timeStr = formatTime();
    onChange?.(timeStr);
  }, [formatTime, onChange]);

  const handleHoursChange = useCallback((delta: number) => {
    let newHours = hours + delta;
    if (newHours < 0) newHours = 23;
    if (newHours > 23) newHours = 0;
    setHours(newHours);
    handleTimeChange();
  }, [hours, handleTimeChange]);

  const handleMinutesChange = useCallback((delta: number) => {
    let newMinutes = minutes + delta;
    if (newMinutes < 0) newMinutes = 60 - minuteInterval;
    if (newMinutes >= 60) newMinutes = 0;
    
    newMinutes = Math.round(newMinutes / minuteInterval) * minuteInterval;
    if (newMinutes >= 60) newMinutes = 0;
    
    setMinutes(newMinutes);
    handleTimeChange();
  }, [minutes, minuteInterval, handleTimeChange]);

  const handlePeriodChange = useCallback((newPeriod: 'AM' | 'PM') => {
    setPeriod(newPeriod);
    handleTimeChange();
  }, [handleTimeChange]);

  const handleInputChange = useCallback((type: 'hours' | 'minutes', inputValue: string) => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num)) return;

    if (type === 'hours') {
      const validHour = Math.min(Math.max(num, 0), 23);
      setHours(validHour);
      // Call onChange directly with new value to avoid async state lag
      const timeStr = formatTimeString(validHour, minutes, period);
      onChange?.(timeStr);
    } else {
      const validMinutes = Math.min(Math.max(num, 0), 59);
      setMinutes(validMinutes);
      // Call onChange directly with new value to avoid async state lag
      const timeStr = formatTimeString(hours, validMinutes, period);
      onChange?.(timeStr);
    }
  }, [hours, minutes, period, format, onChange]);

  // Helper to format time with specific values (not state)
  const formatTimeString = (h: number, m: number, p: 'AM' | 'PM'): string => {
    let hour = h;
    let periodValue = p;
    
    if (format === '12h') {
      if (hour >= 12) {
        periodValue = 'PM';
        hour = hour === 12 ? 12 : hour - 12;
      } else {
        periodValue = 'AM';
        hour = hour === 0 ? 12 : hour;
      }
    }
    
    const hourStr = String(hour).padStart(2, '0');
    const minStr = String(m).padStart(2, '0');
    
    if (format === '12h') {
      return `${hourStr}:${minStr} ${periodValue}`;
    }
    return `${hourStr}:${minStr}`;
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm cursor-pointer',
          'ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300',
          isOpen && 'ring-2 ring-zinc-950 dark:ring-zinc-300'
        )}
      >
        <span className={cn(!value && 'text-zinc-400')}>
          {value || placeholder}
        </span>
        <Clock className="h-4 w-4 text-zinc-500" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[200px] rounded-md border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-center gap-2">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => handleHoursChange(1)}
                className="rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={String(hours).padStart(2, '0')}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val) handleInputChange('hours', val);
                }}
                className="w-12 text-center text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => handleHoursChange(-1)}
                className="rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <span className="text-2xl font-bold">:</span>

            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => handleMinutesChange(minuteInterval)}
                className="rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={String(minutes).padStart(2, '0')}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val) handleInputChange('minutes', val);
                }}
                className="w-12 text-center text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => handleMinutesChange(-minuteInterval)}
                className="rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {format === '12h' && (
              <div className="flex flex-col items-center ml-2">
                <button
                  type="button"
                  onClick={() => handlePeriodChange('AM')}
                  className={cn(
                    'px-2 py-1 text-xs rounded-md transition-colors cursor-pointer',
                    period === 'AM' 
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' 
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  )}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => handlePeriodChange('PM')}
                  className={cn(
                    'px-2 py-1 text-xs rounded-md transition-colors cursor-pointer',
                    period === 'PM' 
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' 
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  )}
                >
                  PM
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
