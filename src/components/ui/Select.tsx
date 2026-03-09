import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDebounce } from '../../hooks/useDebounce';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
  searchFn?: (search: string) => Promise<SelectOption[]>;
  error?: string;
  clearable?: boolean;
}

export function Select({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  className,
  searchable = false,
  searchFn,
  error,
  clearable = true,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [localOptions, setLocalOptions] = useState<SelectOption[]>(options);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(search, 300);

  const selectedOption = localOptions.find(opt => opt.value === value);

  // Filter options for local search (when no searchFn provided)
  const filteredOptions = React.useMemo(() => {
    if (searchable && !searchFn && search) {
      return localOptions.filter(opt => 
        opt.label.toLowerCase().includes(search.toLowerCase())
      );
    }
    return localOptions;
  }, [localOptions, search, searchable, searchFn]);

  useEffect(() => {
    if (searchable && searchFn && debouncedSearch) {
      setIsLoading(true);
      searchFn(debouncedSearch)
        .then((results) => {
          setLocalOptions(results);
        })
        .catch(() => {
          setLocalOptions([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [debouncedSearch, searchable, searchFn]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
    setSearch('');
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
          isOpen && 'ring-2 ring-zinc-950 dark:ring-zinc-300',
          error && 'border-red-500 focus-visible:ring-red-500'
        )}
      >
        <span className={cn(!selectedOption && 'text-zinc-400')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {clearable && value && !disabled && (
            <X 
              className="h-4 w-4 text-zinc-400 hover:text-zinc-600 cursor-pointer" 
              onClick={handleClear}
            />
          )}
          <ChevronDown className={cn('h-4 w-4 text-zinc-500 transition-transform', isOpen && 'rotate-180')} />
        </div>
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[200px] rounded-md border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          {searchable && (
            <div className="flex items-center border-b border-zinc-200 px-2 dark:border-zinc-800">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-zinc-400"
              />
              {isLoading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
              )}
            </div>
          )}
          
          <div className="max-h-60 overflow-y-auto py-1 flex flex-col gap-[1px] scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-zinc-500">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-2 py-2 text-sm transition-colors cursor-pointer',
                    'hover:bg-zinc-100 dark:hover:bg-zinc-800',
                    option.value === value && 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700'
                  )}
                >
                  {option.label}
                  {option.value === value && <Check className="h-4 w-4" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
