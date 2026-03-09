import { Input } from './Input';
import { Select } from './Select';
import { MultiSelect } from './MultiSelect';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';
import { Switch } from './Switch';
import { DatePicker } from './DatePicker';
import { TimePicker } from './TimePicker';
import { type FormData, type UseFormDataReturn } from '../../hooks/useFormData';

export interface FormFields<T> {
  component: 'input' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'switch' | 'datepicker' | 'timepicker' | 'textarea' | 'custom' | 'title';
  label: string;
  field?: keyof T; // Optional for title component
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  required?: boolean;
  // Grid configuration
  colSpan?: number; // Number of columns (1-12)
  // All component props passed through here
  props?: Record<string, unknown>;
  // For custom render function
  render?: (value: unknown, onChange: (value: unknown) => void) => React.ReactNode;
  // For title component
  icon?: React.ComponentType<{ className?: string }>;
}

interface FormFieldProps<T extends object> {
  fields: FormFields<T>[];
  formData: FormData<T>;
  formHelpers: Pick<UseFormDataReturn<T>, 'setData' | 'handleChange' | 'setError' | 'reset' | 'setFieldValue'>;
  children?: React.ReactNode;
  className?: string;
  gridCols?: number; // Default grid columns (1, 2, 3, 4, etc.)
  gap?: string | number; // Tailwind gap class (e.g., '3', '[25px]', '4') or number for gap-N
}

/**
 * Universal FormField component that renders any form component based on configuration
 * @param fields - Array of field configurations
 * @param formData - Current form data and errors
 * @param formHelpers - Form helper functions (setData, handleChange, setError, reset)
 * @param children - Optional children to render (e.g., custom fields)
 * @param className - Additional class names for the container
 * @param gridCols - Number of grid columns (default: 1)
 */
export function FormField<T extends object>({
  fields,
  formData,
  formHelpers,
  children,
  className,
  gridCols = 1,
  gap = '4',
}: FormFieldProps<T>) {
  const visibleFields = fields.filter((field) => !field.hidden);
  const { setFieldValue } = formHelpers;

  // Type-safe access to form data and errors
  const getFieldValue = (field: keyof T): unknown => {
    return formData.data[field];
  };

  const getFieldError = (field: keyof T): string | undefined => {
    return formData.error[field] as string | undefined;
  };

  // Build grid class with custom gap
  const gapClass = typeof gap === 'number' ? `gap-${gap}` : `gap-${gap}`;
  const gridColsClasses: Record<number, string> = {
    1: `grid grid-cols-1 ${gapClass}`,
    2: `grid grid-cols-1 md:grid-cols-2 ${gapClass}`,
    3: `grid grid-cols-1 md:grid-cols-3 ${gapClass}`,
    4: `grid grid-cols-1 md:grid-cols-4 ${gapClass}`,
    5: `grid grid-cols-1 md:grid-cols-5 ${gapClass}`,
    6: `grid grid-cols-1 md:grid-cols-6 ${gapClass}`,
  };

  // Get grid container class
  const gridClass = gridColsClasses[gridCols] || `grid ${gapClass}`;

  // Static col-span classes for Tailwind detection (for 2-column grid)
  const colSpanClasses: Record<number, string> = {
    1: 'col-span-1',
    2: 'col-span-2',
  };

  // Get col-span class for individual fields
  const getColSpanClass = (colSpan?: number): string => {
    if (!colSpan) return '';
    return colSpanClasses[colSpan] || '';
  };

  // Generic change handler that clears errors
  const handleChange = (field: keyof T, value: unknown) => {
    setFieldValue(field, value as string);
    const currentError = formData.error[field];
    if (currentError) {
      formHelpers.setError(field, undefined);
    }
  };

  const renderField = (field: FormFields<T>) => {
    const fieldError = field.field ? getFieldError(field.field) : undefined;
    const fieldValue = field.field ? getFieldValue(field.field) : undefined;
    const colSpanClass = getColSpanClass(field.colSpan);
    const fieldId = (field.field as string) || field.label;

    // Common label component
    const Label = () => (
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );

    // Common error component
    const ErrorMessage = () => fieldError ? (
      <p className="text-sm text-red-500">{fieldError}</p>
    ) : null;

    // Wrapper for all fields
    const FieldWrapper = ({ children }: { children: React.ReactNode }) => (
      <div key={fieldId} className={`grid gap-2 ${colSpanClass} ${field.className || ''}`}>
        <Label />
        {children}
        <ErrorMessage />
      </div>
    );

    // Handle custom render
    if (field.component === 'custom' && field.render && field.field) {
      const f = field.field;
      return (
        <FieldWrapper>
          {field.render(fieldValue, (value) => handleChange(f, value))}
        </FieldWrapper>
      );
    }

    // Render based on component type
    switch (field.component) {
      case 'input': {
        const f = field.field;
        if (!f) return null;
        return (
          <FieldWrapper>
            <Input
              id={fieldId}
              value={(fieldValue as string) || ''}
              onChange={(value) => handleChange(f, value)}
              disabled={field.disabled}
              {...(field.props || {})}
            />
          </FieldWrapper>
        );
      }

      case 'textarea': {
        const f = field.field;
        if (!f) return null;
        return (
          <FieldWrapper>
            <textarea
              id={fieldId}
              value={(fieldValue as string) || ''}
              onChange={(e) => handleChange(f, e.target.value)}
              disabled={field.disabled}
              className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
              {...(field.props || {})}
            />
          </FieldWrapper>
        );
      }

      case 'select': {
        const f = field.field;
        if (!f) return null;
        return (
          <FieldWrapper>
            <Select
              value={(fieldValue as string) || ''}
              onChange={(value) => handleChange(f, value)}
              disabled={field.disabled}
              {...(field.props || {})}
            />
          </FieldWrapper>
        );
      }

      case 'multiselect': {
        const f = field.field;
        if (!f) return null;
        return (
          <FieldWrapper>
            <MultiSelect
              value={(fieldValue as string[]) || []}
              onChange={(value) => handleChange(f, value)}
              disabled={field.disabled}
              {...(field.props || {})}
            />
          </FieldWrapper>
        );
      }

      case 'checkbox': {
        const f = field.field;
        if (!f) return null;
        return (
          <FieldWrapper>
            <Checkbox
              checked={(fieldValue as boolean) || false}
              onChange={(checked) => handleChange(f, checked)}
              disabled={field.disabled}
              {...(field.props || {})}
            />
          </FieldWrapper>
        );
      }

      case 'radio': {
        const f = field.field;
        if (!f) return null;
        return (
          <FieldWrapper>
            <Radio
              value={(fieldValue as string) || ''}
              onChange={(value) => handleChange(f, value)}
              disabled={field.disabled}
              {...(field.props || {})}
            />
          </FieldWrapper>
        );
      }

      case 'switch': {
        const f = field.field;
        if (!f) return null;
        return (
          <FieldWrapper>
            <Switch
              checked={(fieldValue as boolean) || false}
              onChange={(checked) => handleChange(f, checked)}
              disabled={field.disabled}
              {...(field.props || {})}
            />
          </FieldWrapper>
        );
      }

      case 'datepicker': {
        const f = field.field;
        if (!f) return null;
        return (
          <FieldWrapper>
            <DatePicker
              value={(fieldValue as string) || ''}
              onChange={(date) => handleChange(f, date)}
              disabled={field.disabled}
              {...(field.props || {})}
            />
          </FieldWrapper>
        );
      }

      case 'timepicker': {
        const f = field.field;
        if (!f) return null;
        return (
          <FieldWrapper>
            <TimePicker
              value={(fieldValue as string) || ''}
              onChange={(time) => handleChange(f, time)}
              disabled={field.disabled}
              {...(field.props || {})}
            />
          </FieldWrapper>
        );
      }

      case 'title':
        const TitleIcon = field.icon;
        return (
          <div key={fieldId} className={`mt-3 ${colSpanClass} ${field.className || ''}`}>
            <div className="flex items-center gap-2 text-base sm:text-lg font-medium">
              {TitleIcon && <TitleIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
              <h3>{field.label}</h3>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${gridClass} ${className || ''}`}>
      {visibleFields.map(renderField)}
      {children}
    </div>
  );
}
