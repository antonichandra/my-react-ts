import { TimePicker, type TimePickerProps } from '../TimePicker';

interface FieldTimePickerProps {
  label: string;
  value?: string;
  onChange?: (time: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  colSpan?: number;
  props?: TimePickerProps;
}

/**
 * FieldTimePicker - A complete timepicker field component with label, timepicker, and error handling
 */
export function FieldTimePicker({
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
}: FieldTimePickerProps) {
  if (hidden) return null;

  const colSpanClass = colSpan === 2 ? 'col-span-2' : '';

  return (
    <div className={`grid gap-2 ${colSpanClass} ${className || ''}`}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <TimePicker
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        {...(props || {})}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

