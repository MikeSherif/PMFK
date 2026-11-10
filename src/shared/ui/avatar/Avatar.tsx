import { cn } from '@/shared/lib';

type AvatarProps = {
  letter: string;
  className?: string;
};

export function Avatar({ letter, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/15 font-display text-2xl font-bold text-accent',
        className,
      )}
      aria-hidden
    >
      {letter}
    </div>
  );
}
