import { MultiSelect, type MultiSelectProps } from '../MultiSelect';

interface FieldMultiSelectProps {
  label: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  colSpan?: number;
  props?: MultiSelectProps;
}

/**
 * FieldMultiSelect - A complete multiselect field component with label, multiselect, and error handling
 */
export function FieldMultiSelect({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  hidden,
  className,
  colSpan,
  props,
}: FieldMultiSelectProps) {
  if (hidden) return null;

  const colSpanClass = colSpan === 2 ? 'col-span-2' : '';

  return (
    <div className={`grid gap-2 ${colSpanClass} ${className || ''}`}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <MultiSelect
        value={value || []}
        onChange={onChange}
        disabled={disabled}
        {...(props || {})}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

