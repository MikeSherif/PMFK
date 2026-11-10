import { Container } from '@/shared/ui/container';
import { Skeleton } from '@/shared/ui/skeleton';

export default function Loading() {
  return (
    <Container className="py-24">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="mt-6 h-40 w-full" />
    </Container>
  );
}
