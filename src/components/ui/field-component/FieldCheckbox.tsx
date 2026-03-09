import { Checkbox, type CheckboxProps } from '../Checkbox';

interface FieldCheckboxProps {
  label: string;
  value?: boolean;
  onChange?: (checked: boolean) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  colSpan?: number;
  props?: CheckboxProps;
}

/**
 * FieldCheckbox - A complete checkbox field component with label, checkbox, and error handling
 */
export function FieldCheckbox({
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
}: FieldCheckboxProps) {
  if (hidden) return null;

  const colSpanClass = colSpan === 2 ? 'col-span-2' : '';

  return (
    <div className={`grid gap-2 ${colSpanClass} ${className || ''}`}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Checkbox
        checked={value || false}
        onChange={onChange}
        disabled={disabled}
        {...(props || {})}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

