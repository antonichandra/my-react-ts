import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputPrefixProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  prefixClassName?: string;
}

const InputPrefix = React.forwardRef<HTMLInputElement, InputPrefixProps>(
  ({ className, type = "text", prefix, prefixClassName, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {prefix && (
          <span 
            className={cn(
              "absolute left-3 text-sm text-zinc-500 dark:text-zinc-400 pointer-events-none select-none",
              prefixClassName
            )}
          >
            {prefix}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-zinc-200 bg-white py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
            prefix ? "pl-10 pr-3" : "px-3",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
InputPrefix.displayName = "InputPrefix"

export { InputPrefix }
