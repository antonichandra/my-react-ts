
import React, { useMemo, memo, useCallback, useRef } from 'react';
import { Input } from './Input';
import { Select } from './Select';
import { MultiSelect } from './MultiSelect';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';
import { Switch } from './Switch';
import { DatePicker } from './DatePicker';
import { TimePicker } from './TimePicker';
import { type FormData } from '../../hooks/useFormData';

export interface FormFieldConfig<T> {
  component: 'input' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'switch' | 'datepicker' | 'timepicker' | 'textarea' | 'title';
  label: string;
  field?: keyof T;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  required?: boolean;
  colSpan?: number;
  props?: Record<string, unknown>;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FormFieldArrayProps<T extends object> {
  fields: FormFieldConfig<T>[];
  formData: FormData<T>;
  formHelpers: {
    setData: React.Dispatch<React.SetStateAction<T>>;
    setError: (field: keyof T, message: string | undefined) => void;
    reset: () => void;
    setFieldValue: (field: keyof T, value: unknown) => void;
    handleChange?: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  };
  children?: React.ReactNode;
  className?: string;
  gridCols?: number;
  gap?: string | number;
}

// Memoized Label component
const FieldLabel = memo(({ label, required }: { label: string; required?: boolean }) => (
  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    {label}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
));
FieldLabel.displayName = 'FieldLabel';

// Memoized Error component
const FieldError = memo(({ error }: { error?: string }) => 
  error ? <p className="text-sm text-red-500">{error}</p> : null
);
FieldError.displayName = 'FieldError';

// Memoized FieldWrapper
interface FieldWrapperProps {
  children: React.ReactNode;
  label: string;
  error?: string;
  required?: boolean;
  colSpan?: number;
  className?: string;
}

const FieldWrapper = memo(({ children, label, error, required, colSpan, className }: FieldWrapperProps) => {
  const colSpanClass = colSpan === 2 ? 'col-span-2' : '';
  return (
    <div className={`grid gap-2 ${colSpanClass} ${className || ''}`}>
      <FieldLabel label={label} required={required} />
      {children}
      <FieldError error={error} />
    </div>
  );
});
FieldWrapper.displayName = 'FieldWrapper';

// Memoized Input Field
interface MemoizedInputProps {
  field: keyof any;
  fieldId: string;
  value: string;
  onChange: (field: keyof any, value: unknown) => void;
  disabled?: boolean;
  props?: Record<string, unknown>;
}

const MemoizedInput = memo(({ field, fieldId, value, onChange, disabled, props }: MemoizedInputProps) => {
  const handleChange = useCallback((newValue: string) => {
    onChange(field, newValue);
  }, [onChange, field]);

  return (
    <Input
      id={fieldId}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      {...(props || {})}
    />
  );
});
MemoizedInput.displayName = 'MemoizedInput';

// Memoized Select Field
interface MemoizedSelectProps {
  field: keyof any;
  value: string;
  onChange: (field: keyof any, value: unknown) => void;
  disabled?: boolean;
  props?: Record<string, unknown>;
}

const MemoizedSelect = memo(({ field, value, onChange, disabled, props }: MemoizedSelectProps) => {
  const handleChange = useCallback((newValue: string) => {
    onChange(field, newValue);
  }, [onChange, field]);

  return (
    <Select
      value={value}
      onChange={handleChange}
      disabled={disabled}
      {...(props || {})}
    />
  );
});
MemoizedSelect.displayName = 'MemoizedSelect';

// Memoized MultiSelect Field
interface MemoizedMultiSelectProps {
  field: keyof any;
  value: string[];
  onChange: (field: keyof any, value: unknown) => void;
  disabled?: boolean;
  props?: Record<string, unknown>;
}

const MemoizedMultiSelect = memo(({ field, value, onChange, disabled, props }: MemoizedMultiSelectProps) => {
  const handleChange = useCallback((newValue: string[]) => {
    onChange(field, newValue);
  }, [onChange, field]);

  return (
    <MultiSelect
      value={value}
      onChange={handleChange}
      disabled={disabled}
      {...(props || {})}
    />
  );
});
MemoizedMultiSelect.displayName = 'MemoizedMultiSelect';

// Memoized Checkbox Field
interface MemoizedCheckboxProps {
  field: keyof any;
  checked: boolean;
  onChange: (field: keyof any, value: unknown) => void;
  disabled?: boolean;
  props?: Record<string, unknown>;
}

const MemoizedCheckbox = memo(({ field, checked, onChange, disabled, props }: MemoizedCheckboxProps) => {
  const handleChange = useCallback((newChecked: boolean) => {
    onChange(field, newChecked);
  }, [onChange, field]);

  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      {...(props || {})}
    />
  );
});
MemoizedCheckbox.displayName = 'MemoizedCheckbox';

// Memoized Radio Field
interface MemoizedRadioProps {
  field: keyof any;
  value: string;
  onChange: (field: keyof any, value: unknown) => void;
  disabled?: boolean;
  props?: Record<string, unknown>;
}

const MemoizedRadio = memo(({ field, value, onChange, disabled, props }: MemoizedRadioProps) => {
  const handleChange = useCallback((newValue: string) => {
    onChange(field, newValue);
  }, [onChange, field]);

  return (
    <Radio
      value={value}
      onChange={handleChange}
      disabled={disabled}
      {...(props || {})}
    />
  );
});
MemoizedRadio.displayName = 'MemoizedRadio';

// Memoized Switch Field
interface MemoizedSwitchProps {
  field: keyof any;
  checked: boolean;
  onChange: (field: keyof any, value: unknown) => void;
  disabled?: boolean;
  props?: Record<string, unknown>;
}

const MemoizedSwitch = memo(({ field, checked, onChange, disabled, props }: MemoizedSwitchProps) => {
  const handleChange = useCallback((newChecked: boolean) => {
    onChange(field, newChecked);
  }, [onChange, field]);

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      {...(props || {})}
    />
  );
});
MemoizedSwitch.displayName = 'MemoizedSwitch';

// Memoized DatePicker Field
interface MemoizedDatePickerProps {
  field: keyof any;
  value: string;
  onChange: (field: keyof any, value: unknown) => void;
  disabled?: boolean;
  props?: Record<string, unknown>;
}

const MemoizedDatePicker = memo(({ field, value, onChange, disabled, props }: MemoizedDatePickerProps) => {
  const handleChange = useCallback((newValue: string) => {
    onChange(field, newValue);
  }, [onChange, field]);

  return (
    <DatePicker
      value={value}
      onChange={handleChange}
      disabled={disabled}
      {...(props || {})}
    />
  );
});
MemoizedDatePicker.displayName = 'MemoizedDatePicker';

// Memoized TimePicker Field
interface MemoizedTimePickerProps {
  field: keyof any;
  value: string;
  onChange: (field: keyof any, value: unknown) => void;
  disabled?: boolean;
  props?: Record<string, unknown>;
}

const MemoizedTimePicker = memo(({ field, value, onChange, disabled, props }: MemoizedTimePickerProps) => {
  const handleChange = useCallback((newValue: string) => {
    onChange(field, newValue);
  }, [onChange, field]);

  return (
    <TimePicker
      value={value}
      onChange={handleChange}
      disabled={disabled}
      {...(props || {})}
    />
  );
});
MemoizedTimePicker.displayName = 'MemoizedTimePicker';

// Memoized Title component
const MemoizedTitle = memo(({ label, icon: Icon, colSpan, className }: { 
  label: string; 
  icon?: React.ComponentType<{ className?: string }>;
  colSpan?: number;
  className?: string;
}) => {
  const colSpanClass = colSpan === 2 ? 'col-span-2' : '';
  return (
    <div className={`mt-3 ${colSpanClass} ${className || ''}`}>
      <div className="flex items-center gap-2 text-base sm:text-lg font-medium">
        {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
        <h3>{label}</h3>
      </div>
    </div>
  );
});
MemoizedTitle.displayName = 'MemoizedTitle';

/**
 * FormFieldArray - Optimized array-based form field component
 * Uses memo to prevent unnecessary re-renders when other fields change
 * 
 * @example
 * ```tsx
 * const formFields: FormFieldConfig<MyForm>[] = [
 *   { component: 'input', label: 'Name', field: 'name', required: true },
 *   { component: 'input', label: 'Email', field: 'email' },
 *   { component: 'select', label: 'Country', field: 'country', props: { options: [...] }},
 * ];
 * 
 * <FormFieldArray
 *   fields={formFields}
 *   formData={formData}
 *   formHelpers={{ setData, handleChange, setError, reset, setFieldValue }}
 *   gridCols={2}
 * />
 * ```
 */
export function FormFieldArray<T extends object>({
  fields,
  formData,
  formHelpers,
  children,
  className,
  gridCols = 1,
  gap = '4',
}: FormFieldArrayProps<T>) {
  const { setFieldValue, setError } = formHelpers;

  // Use ref to store error to avoid re-render dependency
  const errorRef = useRef(formData.error);
  errorRef.current = formData.error;

  // Memoized change handler - now without formData.error dependency
  const handleChange = useCallback((field: keyof any, value: unknown) => {
    (setFieldValue as (field: keyof any, value: unknown) => void)(field, value);
    // Use ref to check error without causing re-render
    const currentError = errorRef.current[field as keyof T];
    if (currentError) {
      setError(field as keyof T, undefined);
    }
  }, [setFieldValue, setError]);

  // Memoized grid class
  const gridClass = useMemo(() => {
    const gapClass = typeof gap === 'number' ? `gap-${gap}` : `gap-${gap}`;
    const colsMap: Record<number, string> = {
      1: `grid grid-cols-1 ${gapClass}`,
      2: `grid grid-cols-1 md:grid-cols-2 ${gapClass}`,
      3: `grid grid-cols-1 md:grid-cols-3 ${gapClass}`,
      4: `grid grid-cols-1 md:grid-cols-4 ${gapClass}`,
    };
    return colsMap[gridCols] || `grid ${gapClass}`;
  }, [gridCols, gap]);

  // Filter visible fields once
  const visibleFields = useMemo(() => 
    fields.filter((field) => !field.hidden), 
    [fields]
  );

  // Render each field with memoization
  const renderField = useCallback((field: FormFieldConfig<T>, index: number) => {
    const fieldError = field.field ? formData.error[field.field] as string | undefined : undefined;
    const fieldValue = field.field ? formData.data[field.field] : undefined;
    const fieldId = (field.field as string) || field.label;
    const colSpan = field.colSpan;

    switch (field.component) {
      case 'input': {
        if (!field.field) return null;
        return (
          <FieldWrapper
            key={String(field.field)}
            label={field.label}
            error={fieldError}
            required={field.required}
            colSpan={colSpan}
            className={field.className}
          >
            <MemoizedInput
              field={field.field}
              fieldId={fieldId}
              value={(fieldValue as string) || ''}
              onChange={handleChange}
              disabled={field.disabled}
              props={field.props}
            />
          </FieldWrapper>
        );
      }

      case 'textarea': {
        if (!field.field) return null;
        return (
          <FieldWrapper
            key={String(field.field)}
            label={field.label}
            error={fieldError}
            required={field.required}
            colSpan={colSpan}
            className={field.className}
          >
            <textarea
              id={fieldId}
              value={(fieldValue as string) || ''}
              onChange={(e) => handleChange(field.field!, e.target.value)}
              disabled={field.disabled}
              className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
              {...(field.props || {})}
            />
          </FieldWrapper>
        );
      }

      case 'select': {
        if (!field.field) return null;
        return (
          <FieldWrapper
            key={String(field.field)}
            label={field.label}
            error={fieldError}
            required={field.required}
            colSpan={colSpan}
            className={field.className}
          >
            <MemoizedSelect
              field={field.field}
              value={(fieldValue as string) || ''}
              onChange={handleChange}
              disabled={field.disabled}
              props={field.props}
            />
          </FieldWrapper>
        );
      }

      case 'multiselect': {
        if (!field.field) return null;
        return (
          <FieldWrapper
            key={String(field.field)}
            label={field.label}
            error={fieldError}
            required={field.required}
            colSpan={colSpan}
            className={field.className}
          >
            <MemoizedMultiSelect
              field={field.field}
              value={(fieldValue as string[]) || []}
              onChange={handleChange}
              disabled={field.disabled}
              props={field.props}
            />
          </FieldWrapper>
        );
      }

      case 'checkbox': {
        if (!field.field) return null;
        return (
          <FieldWrapper
            key={String(field.field)}
            label={field.label}
            error={fieldError}
            required={field.required}
            colSpan={colSpan}
            className={field.className}
          >
            <MemoizedCheckbox
              field={field.field}
              checked={(fieldValue as boolean) || false}
              onChange={handleChange}
              disabled={field.disabled}
              props={field.props}
            />
          </FieldWrapper>
        );
      }

      case 'radio': {
        if (!field.field) return null;
        return (
          <FieldWrapper
            key={String(field.field)}
            label={field.label}
            error={fieldError}
            required={field.required}
            colSpan={colSpan}
            className={field.className}
          >
            <MemoizedRadio
              field={field.field}
              value={(fieldValue as string) || ''}
              onChange={handleChange}
              disabled={field.disabled}
              props={field.props}
            />
          </FieldWrapper>
        );
      }

      case 'switch': {
        if (!field.field) return null;
        return (
          <FieldWrapper
            key={String(field.field)}
            label={field.label}
            error={fieldError}
            required={field.required}
            colSpan={colSpan}
            className={field.className}
          >
            <MemoizedSwitch
              field={field.field}
              checked={(fieldValue as boolean) || false}
              onChange={handleChange}
              disabled={field.disabled}
              props={field.props}
            />
          </FieldWrapper>
        );
      }

      case 'datepicker': {
        if (!field.field) return null;
        return (
          <FieldWrapper
            key={String(field.field)}
            label={field.label}
            error={fieldError}
            required={field.required}
            colSpan={colSpan}
            className={field.className}
          >
            <MemoizedDatePicker
              field={field.field}
              value={(fieldValue as string) || ''}
              onChange={handleChange}
              disabled={field.disabled}
              props={field.props}
            />
          </FieldWrapper>
        );
      }

      case 'timepicker': {
        if (!field.field) return null;
        return (
          <FieldWrapper
            key={String(field.field)}
            label={field.label}
            error={fieldError}
            required={field.required}
            colSpan={colSpan}
            className={field.className}
          >
            <MemoizedTimePicker
              field={field.field}
              value={(fieldValue as string) || ''}
              onChange={handleChange}
              disabled={field.disabled}
              props={field.props}
            />
          </FieldWrapper>
        );
      }

      case 'title':
        return (
          <MemoizedTitle
            key={`title-${index}`}
            label={field.label}
            icon={field.icon}
            colSpan={colSpan}
            className={field.className}
          />
        );

      default:
        return null;
    }
  }, [formData.error, formData.data, handleChange]);

  // Memoized field list
  const fieldElements = useMemo(() => 
    visibleFields.map((field, index) => renderField(field, index)),
    [visibleFields, renderField]
  );

  return (
    <div className={`${gridClass} ${className || ''}`}>
      {fieldElements}
      {children}
    </div>
  );
}


