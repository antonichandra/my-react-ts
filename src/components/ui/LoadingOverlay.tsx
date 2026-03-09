import { cn } from '../../lib/utils';

export interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ 
  isLoading, 
  message = 'Loading...',
  className 
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className={cn(
      'absolute inset-0 z-50 flex items-center justify-center',
      'bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80',
      className
    )}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {message}
        </span>
      </div>
    </div>
  );
}
