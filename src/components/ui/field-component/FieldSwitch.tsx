import { Switch, type SwitchProps } from '../Switch';

interface FieldSwitchProps {
  label: string;
  value?: boolean;
  onChange?: (checked: boolean) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  colSpan?: number;
  props?: SwitchProps;
}

/**
 * FieldSwitch - A complete switch field component with label, switch, and error handling
 */
export function FieldSwitch({
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
}: FieldSwitchProps) {
  if (hidden) return null;

  const colSpanClass = colSpan === 2 ? 'col-span-2' : '';

  return (
    <div className={`grid gap-2 ${colSpanClass} ${className || ''}`}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Switch
        checked={value || false}
        onChange={onChange}
        disabled={disabled}
        {...(props || {})}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

