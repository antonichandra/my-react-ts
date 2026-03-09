import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDebounce } from '../../hooks/useDebounce';

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  options?: MultiSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
  searchFn?: (search: string) => Promise<MultiSelectOption[]>;
  error?: string;
  maxSelected?: number;
}

export function MultiSelect({
  value = [],
  onChange,
  options = [],
  placeholder = 'Select options',
  disabled = false,
  className,
  searchable = false,
  searchFn,
  error,
  maxSelected,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [localOptions, setLocalOptions] = useState<MultiSelectOption[]>(options);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(search, 300);

  const selectedOptions = localOptions.filter(opt => value.includes(opt.value));

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
    if (value.includes(optionValue)) {
      onChange?.(value.filter(v => v !== optionValue));
    } else {
      if (maxSelected && value.length >= maxSelected) return;
      onChange?.([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(value.filter(v => v !== optionValue));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([]);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex h-auto min-h-[40px] w-full flex-wrap items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm cursor-pointer',
          'ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300',
          isOpen && 'ring-2 ring-zinc-950 dark:ring-zinc-300',
          error && 'border-red-500 focus-visible:ring-red-500'
        )}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedOptions.length === 0 ? (
            <span className="text-zinc-400">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800"
              >
                {option.label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={(e) => handleRemove(option.value, e)}
                />
              </span>
            ))
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          {value.length > 0 && !disabled && (
            <X
              className="h-4 w-4 cursor-pointer text-zinc-400 hover:text-zinc-600"
              onClick={handleClearAll}
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
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                const isDisabled = !isSelected && maxSelected !== undefined && value.length >= maxSelected;
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !isDisabled && handleSelect(option.value)}
                    disabled={isDisabled}
                    className={cn(
                      'flex w-full items-center justify-between rounded-md px-2 py-2 text-sm transition-colors cursor-pointer',
                      'hover:bg-zinc-100 dark:hover:bg-zinc-800',
                      isSelected && 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {option.label}
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                );
              })
            )}
          </div>
          
          {maxSelected && (
            <div className="border-t border-zinc-200 px-2 py-2 text-xs text-zinc-500 dark:border-zinc-800">
              {value.length} of {maxSelected} selected
            </div>
          )}
        </div>
      )}
    </div>
  );
}
