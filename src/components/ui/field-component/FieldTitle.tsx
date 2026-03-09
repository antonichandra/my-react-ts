interface FieldTitleProps {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  hidden?: boolean;
  className?: string;
  colSpan?: number;
}

/**
 * FieldTitle - A section title component with optional icon
 */
export function FieldTitle({
  label,
  icon,
  hidden,
  className,
  colSpan,
}: FieldTitleProps) {
  if (hidden) return null;

  const colSpanClass = colSpan === 2 ? 'col-span-2' : '';
  const TitleIcon = icon;

  return (
    <div className={`mt-3 ${colSpanClass} ${className || ''}`}>
      <div className="flex items-center gap-2 text-base sm:text-lg font-medium">
        {TitleIcon && <TitleIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
        <h3>{label}</h3>
      </div>
    </div>
  );
}

