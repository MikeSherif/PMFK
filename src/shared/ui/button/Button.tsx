import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '@/shared/lib';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 data-[loading=true]:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-bg glow-cta hover:bg-accent-hover active:bg-accent-pressed',
        secondary:
          'border border-border-strong bg-transparent text-text hover:bg-surface',
        ghost: 'bg-transparent text-text hover:bg-surface',
        link: 'bg-transparent text-accent underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-11 min-h-11 rounded-pill px-4 text-sm',
        md: 'h-12 rounded-pill px-6 text-base',
        lg: 'h-14 rounded-pill px-8 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    fullWidth,
    asChild = false,
    loading = false,
    iconLeft,
    iconRight,
    children,
    disabled,
    type = 'button',
    ...props
  },
  ref,
) {
  const classes = cn(buttonVariants({ variant, size, fullWidth }), className);

  if (asChild) {
    return (
      <Slot ref={ref} className={classes} data-loading={loading ? 'true' : 'false'} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      data-loading={loading ? 'true' : 'false'}
      {...props}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-text/30 border-t-text"
          aria-hidden
        />
      ) : (
        iconLeft
      )}
      {children}
      {iconRight}
    </button>
  );
});
