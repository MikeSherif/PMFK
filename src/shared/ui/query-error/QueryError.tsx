import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';

type QueryErrorProps = {
  title: string;
  description?: string;
  retryLabel: string;
  onRetry: () => void;
};

export function QueryError({ title, description, retryLabel, onRetry }: QueryErrorProps) {
  return (
    <EmptyState
      title={title}
      {...(description ? { description } : {})}
      action={
        <Button type="button" variant="secondary" onClick={onRetry}>
          {retryLabel}
        </Button>
      }
    />
  );
}
