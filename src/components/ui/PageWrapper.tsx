import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface PageWrapperProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  /**
   * Maximum width of the container (default: '4xl')
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
  /**
   * Vertical spacing between elements (default: 'space-y-4')
   */
  space?: boolean;
  /**
   * Whether to enable animation (default: true)
   */
  animate?: boolean;
}

/**
 * PageWrapper - A reusable wrapper component with fade-in animation
 * Use this instead of repeating motion.div in every page
 * 
 * @example
 * ```tsx
 * <PageWrapper>
 *   <h1>My Page Content</h1>
 * </PageWrapper>
 * ```
 */
export function PageWrapper({
  children,
  maxWidth = '4xl',
  space = true,
  animate = true,
  className,
  ...props
}: PageWrapperProps) {
  const maxWidthClasses: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full',
  };

  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
      }
    : {};

  return (
    <motion.div
      {...motionProps}
      className={cn(
        maxWidthClasses[maxWidth],
        'mx-auto',
        space && 'space-y-4 sm:space-y-6',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
