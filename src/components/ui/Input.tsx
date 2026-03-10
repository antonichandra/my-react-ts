import * as React from "react"
import { cn } from "../../lib/utils"
import type { LucideIcon } from "lucide-react"
import { NumericFormat } from "react-number-format";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string | number;
  onChange?: (value: string) => void;
  prefix?: string;
  prefixClassName?: string;
  suffix?: string;
  suffixClassName?: string;
  icon?: LucideIcon | string;
  iconPosition?: 'left' | 'right';
  iconClassName?: string;
  onIconClick?: () => void;
  currency?: boolean;
  allowNegative?: boolean;
  decimalScale?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text",
    value = '', 
    onChange, 
    prefix, 
    prefixClassName,
    suffix,
    suffixClassName,
    icon,
    iconPosition = 'left',
    iconClassName,
    onIconClick,
    currency = true,
    allowNegative,
    decimalScale = 0,
    placeholder,
    ...props 
  }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      setDisplayValue(inputValue);
      onChange?.(inputValue);
    };

    const inputMode = type === 'number' || type === 'phone' ? "numeric" : undefined;

    // Check if icon is a Lucide component or a string
    const isLucideIcon = icon && typeof icon !== 'string';
    const iconString = icon && typeof icon === 'string' ? icon : null;

    // Calculate padding based on prefix/icon and suffix
    let paddingLeft = "pl-3";
    let paddingRight = "pr-3";
    
    // Left side calculations
    if (iconPosition === 'left') {
      if (icon && prefix) {
        paddingLeft = "pl-16"; // Both icon and prefix
      } else if (icon) {
        paddingLeft = "pl-10"; // Only icon
      } else if (prefix) {
        paddingLeft = "pl-10"; // Only prefix
      }
    } else {
      // Icon on right
      if (prefix) {
        paddingLeft = "pl-10"; // Only prefix
      }
    }
    
    // Right side calculations
    if (iconPosition === 'right') {
      if (icon && suffix) {
        paddingRight = "pr-16"; // Both icon and suffix
      } else if (icon) {
        paddingRight = "pr-10"; // Only icon
      } else if (suffix) {
        paddingRight = "pr-10"; // Only suffix
      }
    } else {
      // Icon on left
      if (suffix) {
        paddingRight = "pr-10"; // Only suffix
      }
    }

    const iconButtonClasses = cn(
      "flex items-center justify-center text-zinc-500 dark:text-zinc-400 z-10 text-sm",
      onIconClick && "cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300",
      !onIconClick && "pointer-events-none select-none",
      iconClassName
    );

    const renderIcon = () => {
      if (!icon) return null;
      
      const positionClasses = iconPosition === 'left' ? "absolute left-3" : "absolute right-3";
      
      // Create the icon element
      const IconComponent = isLucideIcon ? (icon as LucideIcon) : null;
      
      return (
        <button
          type="button"
          onClick={onIconClick}
          className={cn(positionClasses, iconButtonClasses)}
          tabIndex={onIconClick ? 0 : -1}
        >
          {IconComponent ? (
            <IconComponent className="h-4 w-4" />
          ) : (
            <span>{iconString}</span>
          )}
        </button>
      );
    };

    return (
      <div className="relative flex items-center">
        {/* Left Icon */}
        {iconPosition === 'left' && renderIcon()}
        
        {/* Prefix (if no left icon) */}
        {!(iconPosition === 'left' && icon) && prefix && (
          <span 
            className={cn(
              "absolute left-3 text-sm text-zinc-500 dark:text-zinc-400 pointer-events-none select-none z-10",
              prefixClassName
            )}
          >
            {prefix}
          </span>
        )}
        
        {/* Prefix (if has left icon) */}
        {iconPosition === 'left' && icon && prefix && (
          <span 
            className={cn(
              "absolute left-9 text-sm text-zinc-500 dark:text-zinc-400 pointer-events-none select-none z-10",
              prefixClassName
            )}
          >
            {prefix}
          </span>
        )}

        {type === "number" ? (
          <NumericFormat
            thousandSeparator={currency ? ',' : null}
            decimalScale={decimalScale}
            allowNegative={allowNegative}
            value={value}
            onValueChange={(values) => onChange?.(values.formattedValue)}
            placeholder={placeholder}
            className={cn(
              "flex h-10 w-full rounded-md border border-zinc-200 bg-white py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
              paddingLeft,
              paddingRight,
              className
            )}
            {...props as any}
          />
        ) : (
          <input
            type={type}
            inputMode={inputMode}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={cn(
              "flex h-10 w-full rounded-md border border-zinc-200 bg-white py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
              paddingLeft,
              paddingRight,
              className
            )}
            ref={ref}
            {...props}
          />
        )}
        
        {/* Suffix (if no right icon) */}
        {!(iconPosition === 'right' && icon) && suffix && (
          <span 
            className={cn(
              "absolute right-3 text-sm text-zinc-500 dark:text-zinc-400 pointer-events-none select-none z-10",
              suffixClassName
            )}
          >
            {suffix}
          </span>
        )}
        
        {/* Suffix (if has right icon) */}
        {iconPosition === 'right' && icon && suffix && (
          <span 
            className={cn(
              "absolute right-9 text-sm text-zinc-500 dark:text-zinc-400 pointer-events-none select-none z-10",
              suffixClassName
            )}
          >
            {suffix}
          </span>
        )}
        
        {/* Right Icon */}
        {iconPosition === 'right' && renderIcon()}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
