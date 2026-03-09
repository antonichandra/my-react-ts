import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: string;
  maxDate?: string;
  format?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  className,
  minDate,
  maxDate,
  format = 'yyyy-MM-dd',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return new Date();
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return null;
  });
  const [, setScrollYear] = useState(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.getFullYear();
      }
    }
    return new Date().getFullYear();
  });
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset currentMonth to selected date when closing without selection
  useEffect(() => {
    if (!isOpen) {
      // Reset to selected date or initial value when closing
      if (selectedDate) {
        setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
        setScrollYear(selectedDate.getFullYear());
      } else if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          setCurrentMonth(date);
          setScrollYear(date.getFullYear());
        }
      }
      hasScrolledRef.current = false;
    }
  }, [isOpen, selectedDate, value]);

  // Auto-scroll to center current month when currentMonth changes (while panel is hidden)
  useEffect(() => {
    // Scroll immediately when currentMonth changes, while panel is still hidden
    // This ensures when user opens the panel, it's already at the correct position
    if (leftPanelRef.current) {
      const currentButton = leftPanelRef.current.querySelector('[data-current-month="true"]') as HTMLElement;
      if (currentButton) {
        // Instant scroll without animation
        currentButton.scrollIntoView({ 
          behavior: 'auto', 
          block: 'center' 
        });
      }
    }
  }, [currentMonth]);

  // Initial scroll on mount (after DOM is ready)
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered on initial load
    const timer = setTimeout(() => {
      if (leftPanelRef.current) {
        const currentButton = leftPanelRef.current.querySelector('[data-current-month="true"]') as HTMLElement;
        if (currentButton) {
          currentButton.scrollIntoView({ 
            behavior: 'auto', 
            block: 'center' 
          });
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    if (format === 'yyyy-MM-dd') {
      return `${year}-${month}-${day}`;
    }
    return `${month}/${day}/${year}`;
  };

  const formatDisplayDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const isDateDisabled = (date: Date) => {
    const dateStr = formatDate(date);
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    return false;
  };

  const handleDateClick = (day: number) => {
    if (disabled) return;
    
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (isDateDisabled(newDate)) return;
    
    setSelectedDate(newDate);
    const dateStr = formatDate(newDate);
    onChange?.(dateStr);
    setIsOpen(false);
  };

  const handleMonthSelect = (year: number, monthIndex: number) => {
    setCurrentMonth(new Date(year, monthIndex, 1));
    setScrollYear(year);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getMinYear = () => {
    if (minDate) {
      return new Date(minDate).getFullYear();
    }
    return new Date().getFullYear() - 50;
  };

  const getMaxYear = () => {
    if (maxDate) {
      return new Date(maxDate).getFullYear();
    }
    return new Date().getFullYear() + 50;
  };

  const renderLeftPanel = () => {
    const items = [];
    const minYear = getMinYear();
    const maxYear = getMaxYear();
    
    // Generate months from minYear to maxYear
    for (let year = minYear; year <= maxYear; year++) {
      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        // Skip months before minDate
        if (year === minYear && minDate) {
          const minMonth = new Date(minDate).getMonth();
          if (monthIndex < minMonth) continue;
        }
        // Skip months after maxDate
        if (year === maxYear && maxDate) {
          const maxMonth = new Date(maxDate).getMonth();
          if (monthIndex > maxMonth) continue;
        }
        
        const isCurrentMonth = currentMonth.getFullYear() === year && currentMonth.getMonth() === monthIndex;
        const isSelected = selectedDate && selectedDate.getFullYear() === year && selectedDate.getMonth() === monthIndex;
        
        if (monthIndex === 0) {
          items.push(
            <div key={`year-${year}`} className="h-[30px] flex items-center justify-center text-[14px] font-bold text-black dark:text-white">
              {year}
            </div>
          );
        }
        
        items.push(
          <button
            key={`${year}-${monthIndex}`}
            data-current-month={isCurrentMonth ? "true" : undefined}
            type="button"
            onClick={() => handleMonthSelect(year, monthIndex)}
            className={cn(
              'h-[26px] sm:h-[30px] w-full text-[10px] sm:text-xs transition-colors flex items-center justify-center cursor-pointer',
              'hover:bg-zinc-100 dark:hover:bg-zinc-800',
              isCurrentMonth && 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200',
              !isCurrentMonth && 'text-zinc-900 dark:text-zinc-100',
              isSelected && !isCurrentMonth && 'ring-1 ring-zinc-900 dark:ring-zinc-100'
            )}
          >
            {monthNames[monthIndex].slice(0, 3)}
          </button>
        );
      }
    }
    return items;
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-[26px] sm:h-[30px]" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === month && 
        selectedDate.getFullYear() === year;
      const isToday = new Date().toDateString() === date.toDateString();
      const disabled = isDateDisabled(date);
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(day)}
          disabled={disabled}
          className={cn(
            'h-[26px] w-[26px] sm:h-[30px] sm:w-[30px] rounded-md text-[10px] sm:text-xs transition-colors cursor-pointer',
            'hover:bg-zinc-100 dark:hover:bg-zinc-800',
            isSelected && 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200',
            !isSelected && 'text-zinc-900 dark:text-zinc-100',
            isToday && !isSelected && 'ring-2 ring-zinc-900 dark:ring-zinc-100',
            disabled && 'opacity-30 cursor-not-allowed'
          )}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
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
          <span className={cn(!selectedDate && 'text-zinc-400')}>
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
          </span>
          <Calendar className="h-4 w-4 text-zinc-500" />
        </button>
      </div>
      
      <div className={cn(
        "absolute z-50 mt-1 rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950 flex",
        !isOpen && "opacity-0 pointer-events-none",
        "left-0 sm:left-auto right-0 sm:right-auto"
      )}>
          {/* Left Panel - Month List */}
          <div 
            ref={leftPanelRef}
            className="w-[70px] sm:w-[80px] h-[280px] sm:h-[300px] overflow-y-auto border-r border-zinc-200 dark:border-zinc-700 scrollbar-hide"
            style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {renderLeftPanel()}
          </div>
          
          {/* Right Panel - Calendar */}
          <div className="w-[220px] sm:w-[250px] h-[280px] sm:h-[300px] p-2 sm:p-3 flex flex-col">
            <div className="mb-1 sm:mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <span className="text-xs sm:text-sm font-medium">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center text-[9px] sm:text-[10px] font-medium text-zinc-500"
                >
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 flex-1">
              {renderCalendar()}
            </div>
          </div>
        </div>
    </div>
  );
}
