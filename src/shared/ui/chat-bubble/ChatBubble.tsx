import { type ReactNode } from 'react';
import { cn } from '@/shared/lib';

type ChatBubbleProps = {
  fromMe: boolean;
  text: string;
  meta: string;
  action?: ReactNode;
  className?: string;
};

export function ChatBubble({ fromMe, text, meta, action, className }: ChatBubbleProps) {
  return (
    <div className={cn(fromMe ? 'ml-8 self-end' : 'mr-8 self-start', className)}>
      <p
        className={
          fromMe ? 'rounded-lg bg-accent px-4 py-2 text-text' : 'rounded-lg bg-surface px-4 py-2'
        }
      >
        {text}
      </p>
      <p className="mt-1 text-xs text-text-muted">{meta}</p>
      {action}
    </div>
  );
}
