import * as React from "react"
import { cn } from "../../lib/utils"
import type { LucideIcon } from "lucide-react"

export interface InputIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  iconClassName?: string;
  onIconClick?: () => void;
}

const InputIcon = React.forwardRef<HTMLInputElement, InputIconProps>(
  ({ className, type = "text", icon: Icon, iconClassName, onIconClick, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {Icon && (
          <button
            type="button"
            onClick={onIconClick}
            className={cn(
              "absolute left-3 flex items-center justify-center text-zinc-500 dark:text-zinc-400",
              onIconClick && "cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300",
              !onIconClick && "pointer-events-none",
              iconClassName
            )}
            tabIndex={onIconClick ? 0 : -1}
          >
            <Icon className="h-4 w-4" />
          </button>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-zinc-200 bg-white py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
            Icon ? "pl-10 pr-3" : "px-3",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
InputIcon.displayName = "InputIcon"

export { InputIcon }
