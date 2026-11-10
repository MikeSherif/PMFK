import { Skeleton } from '@/shared/ui/skeleton';

export default function ConnectLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
